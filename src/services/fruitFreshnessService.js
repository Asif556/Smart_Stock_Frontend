import * as tf from '@tensorflow/tfjs';

class FruitFreshnessService {
  constructor() {
    this.model = null;
    this.modelURL = '/models/fruit-freshness/model.json';
    this.labels = ['Healthy', 'Rotten'];
    this.imageSize = 224;
    this.isLoading = false;
  }

  async loadModel() {
    if (this.model) return this.model;
    
    try {
      this.isLoading = true;
      console.log('Loading fruit freshness model...');
      
      // Load the model from public directory
      this.model = await tf.loadLayersModel(this.modelURL);
      console.log('Fruit freshness model loaded successfully');
      
      return this.model;
    } catch (error) {
      console.error('Error loading fruit freshness model:', error);
      throw new Error('Failed to load AI model. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async predictFreshness(imageFile) {
    try {
      // Ensure model is loaded
      if (!this.model) {
        await this.loadModel();
      }

      // Process the image
      const processedImage = await this.preprocessImage(imageFile);
      
      // Make prediction
      const predictions = await this.model.predict(processedImage).data();
      
      // Process results
      const results = this.processResults(predictions);
      
      // Clean up tensor
      processedImage.dispose();
      
      return {
        success: true,
        prediction: results.topPrediction,
        confidence: results.confidence,
        allPredictions: results.allPredictions,
        recommendation: this.getRecommendation(results.topPrediction, results.confidence)
      };
      
    } catch (error) {
      console.error('Error predicting fruit freshness:', error);
      return {
        success: false,
        error: error.message || 'Failed to analyze image'
      };
    }
  }

  async preprocessImage(imageFile) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size to model requirements
          canvas.width = this.imageSize;
          canvas.height = this.imageSize;
          
          // Draw and resize image
          ctx.drawImage(img, 0, 0, this.imageSize, this.imageSize);
          
          // Convert to tensor
          const tensor = tf.browser.fromPixels(canvas)
            .resizeNearestNeighbor([this.imageSize, this.imageSize])
            .toFloat()
            .div(255.0)
            .expandDims();
          
          resolve(tensor);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Load image
      if (imageFile instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
      } else {
        img.src = imageFile;
      }
    });
  }

  processResults(predictions) {
    const results = this.labels.map((label, index) => ({
      label,
      confidence: predictions[index],
      percentage: (predictions[index] * 100).toFixed(1)
    }));

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);
    
    const topPrediction = results[0];
    
    // Map to our classification system
    const mappedPrediction = this.mapToFreshnessScale(topPrediction.label, topPrediction.confidence);
    
    return {
      topPrediction: mappedPrediction,
      confidence: topPrediction.confidence,
      allPredictions: results
    };
  }

  mapToFreshnessScale(label, confidence) {
    // Map binary classification to our 3-level system
    if (label === 'Healthy') {
      if (confidence > 0.85) {
        return 'Fresh';
      } else if (confidence > 0.6) {
        return 'Good';
      } else {
        return 'Fair';
      }
    } else { // Rotten
      if (confidence > 0.8) {
        return 'Bad';
      } else if (confidence > 0.6) {
        return 'Fair';
      } else {
        return 'Good';
      }
    }
  }

  getRecommendation(prediction, confidence) {
    const confidencePercent = (confidence * 100).toFixed(1);
    
    switch (prediction) {
      case 'Fresh':
        return {
          message: `This fruit appears to be fresh and high quality (${confidencePercent}% confidence)`,
          action: 'Perfect for immediate sale or consumption',
          color: 'green',
          storageAdvice: 'Store in optimal conditions to maintain freshness'
        };
      case 'Good':
        return {
          message: `This fruit is in good condition (${confidencePercent}% confidence)`,
          action: 'Suitable for sale, monitor for changes',
          color: 'yellow',
          storageAdvice: 'Use within recommended timeframe'
        };
      case 'Fair':
        return {
          message: `This fruit shows some quality concerns (${confidencePercent}% confidence)`,
          action: 'Consider discounted pricing or quick sale',
          color: 'orange',
          storageAdvice: 'Sell soon or use for processed products'
        };
      case 'Bad':
        return {
          message: `This fruit appears to be spoiled (${confidencePercent}% confidence)`,
          action: 'Remove from inventory immediately',
          color: 'red',
          storageAdvice: 'Dispose of safely, check nearby items'
        };
      default:
        return {
          message: 'Unable to determine fruit quality',
          action: 'Manual inspection recommended',
          color: 'gray',
          storageAdvice: 'Follow standard storage procedures'
        };
    }
  }

  async checkModelHealth() {
    try {
      if (!this.model) {
        await this.loadModel();
      }
      
      // Create a test tensor
      const testTensor = tf.zeros([1, this.imageSize, this.imageSize, 3]);
      const prediction = await this.model.predict(testTensor).data();
      testTensor.dispose();
      
      return {
        isHealthy: true,
        modelLoaded: !!this.model,
        message: 'AI model is ready for fruit analysis'
      };
    } catch (error) {
      return {
        isHealthy: false,
        modelLoaded: false,
        message: 'AI model is not available: ' + error.message
      };
    }
  }

  getModelInfo() {
    return {
      name: 'Fruit Freshness Classifier',
      version: '1.0.0',
      inputSize: `${this.imageSize}x${this.imageSize}`,
      classes: this.labels,
      description: 'AI model trained to classify fruit freshness and quality'
    };
  }
}

export default new FruitFreshnessService();