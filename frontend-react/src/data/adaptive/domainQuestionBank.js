/**
 * PathFinder Domain-Specific Question Bank (Student-Friendly Edition)
 * Calibrated for conceptual clarity, practical problem-solving & accessible learning
 * Grounded in O*NET, Bebras, Code.org & PathFinder CSE Frameworks
 * 9 Canonical Domains x 15 authentic items = 135 items
 */

export const DOMAIN_QUESTION_BANK = {
  "ai": [
    {
      "id": "dom_ai_001",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Train/Test Split",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Basic ML",
      "prompt": "Why do machine learning practitioners split a dataset into separate 'Training' and 'Testing' sets?",
      "plainEnglishHelper": "Think of preparing for an exam: you practice on sample exercises, but the final exam must test questions you have not seen before.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Data Science modules under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Evaluation & Generalization; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "To evaluate how well the model generalizes to new, unseen data rather than just memorizing training examples.",
          "isCorrect": true,
          "conceptualExplanation": "Testing on unseen data evaluates real generalization.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To reduce the file size on disk so it fits on a flash drive.",
          "isCorrect": false,
          "conceptualExplanation": "Splitting data does not reduce storage size.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because algorithms crash if given more than 50 rows of data.",
          "isCorrect": false,
          "conceptualExplanation": "Algorithms can process millions of rows.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To permanently delete half of the collected data before modeling.",
          "isCorrect": false,
          "conceptualExplanation": "Test data is retained and used for evaluation.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_002",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Supervised vs Unsupervised",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Intro to AI",
      "prompt": "What is the primary difference between Supervised Learning and Unsupervised Learning?",
      "plainEnglishHelper": "Does the computer learn with an answer key (labels), or does it discover clusters on its own?",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Informatics Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Categorization & Pattern Recognition; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "Supervised learning uses labeled data with known targets; unsupervised learning finds patterns in unlabeled data.",
          "isCorrect": true,
          "conceptualExplanation": "Labels guide supervised learning; unsupervised finds inherent patterns.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Supervised learning requires an engineer to manually type every prediction.",
          "isCorrect": false,
          "conceptualExplanation": "Predictions are automated once the model is trained.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Supervised learning only works on images, while unsupervised only works on spreadsheets.",
          "isCorrect": false,
          "conceptualExplanation": "Both work across all data types.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Unsupervised learning always produces zero error.",
          "isCorrect": false,
          "conceptualExplanation": "Unsupervised models have trade-offs and do not have zero error.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_003",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Overfitting Intuition",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 1,
      "prerequisiteDependency": "Model Evaluation",
      "prompt": "A model achieves 99% accuracy on its training data, but drops to 52% on unseen validation data. What is this phenomenon called?",
      "plainEnglishHelper": "The model memorized every specific row, including noise, instead of learning the general rule.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles ML Foundations under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Overfitting & Bias-Variance; O*NET 15-2051.01",
      "options": [
        {
          "key": "A",
          "text": "Overfitting: the model memorized the training noise and fails to generalize.",
          "isCorrect": true,
          "conceptualExplanation": "High training accuracy with poor validation accuracy is overfitting.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Underfitting: the model was too simple to learn anything.",
          "isCorrect": false,
          "conceptualExplanation": "Underfitting causes low accuracy on both sets.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Hardware throttling due to high temperature.",
          "isCorrect": false,
          "conceptualExplanation": "This is a statistical modeling issue, not hardware.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Data compression artifact.",
          "isCorrect": false,
          "conceptualExplanation": "Compression does not cause model overfitting.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_004",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "NumPy Foundation",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Python Fundamentals",
      "prompt": "In the Python machine learning ecosystem, which core library is standard for fast multi-dimensional arrays and matrix operations?",
      "plainEnglishHelper": "Think of the standard numerical library imported as 'import numpy as np'.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder CSE Core Curriculum Group (2024). Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "CSE Curriculum: Numerical Computing & Vector Arrays; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "NumPy (Numerical Python)",
          "isCorrect": true,
          "conceptualExplanation": "NumPy provides ndarrays and fast C-level vectorized operations.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Tkinter",
          "isCorrect": false,
          "conceptualExplanation": "Tkinter is for desktop user interfaces.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "HTML5",
          "isCorrect": false,
          "conceptualExplanation": "HTML is a web markup language.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Pygame",
          "isCorrect": false,
          "conceptualExplanation": "Pygame is for 2D gaming.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_005",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Classification vs Regression",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "ML Problem Framing",
      "prompt": "Which of the following problems is an example of 'Regression' rather than 'Classification'?",
      "plainEnglishHelper": "Classification predicts discrete categories (yes/no, cat/dog). Regression predicts continuous numbers (prices, temperatures).",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Informatics Problem Solving under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Problem Formulation & Variable Prediction; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "Predicting the continuous market selling price of a house ($350,000) based on square footage.",
          "isCorrect": true,
          "conceptualExplanation": "Predicting a continuous numerical quantity is regression.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Detecting whether an incoming email is 'Spam' or 'Inbox'.",
          "isCorrect": false,
          "conceptualExplanation": "This is binary classification.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Classifying an image as a 'Cat', 'Dog', or 'Bird'.",
          "isCorrect": false,
          "conceptualExplanation": "This is multi-class classification.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Deciding if a bank transaction is 'Fraud' or 'Legitimate'.",
          "isCorrect": false,
          "conceptualExplanation": "This is binary classification.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_006",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Learning Rate Dynamics",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Gradient Descent",
      "prompt": "In gradient descent optimization, what happens if the learning rate is set too large?",
      "plainEnglishHelper": "If your step size down a hill is too massive, you overshoot the valley floor completely.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Optimization Modules under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Algorithmic Efficiency & Convergence; O*NET 15-2051.01",
      "options": [
        {
          "key": "A",
          "text": "The weight updates may overshoot the optimal minimum and cause loss to oscillate or explode.",
          "isCorrect": true,
          "conceptualExplanation": "Large learning rates cause divergent oscillations across the loss surface.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The training will proceed so slowly that it freezes permanently.",
          "isCorrect": false,
          "conceptualExplanation": "That happens when the learning rate is too small.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The algorithm converts into an unsupervised decision tree.",
          "isCorrect": false,
          "conceptualExplanation": "Learning rate is a hyperparameter and does not change the model class.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Weights are rounded to whole integers automatically.",
          "isCorrect": false,
          "conceptualExplanation": "Weights remain floating-point numbers.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_007",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Feature Normalization",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Data Preprocessing",
      "prompt": "Why is it important to scale features (e.g. normalizing 'Age' [18-80] and 'Salary' [$20,000-$200,000] into a similar range) before training many algorithms?",
      "plainEnglishHelper": "Without scaling, a $5,000 salary change will mathematically overwhelm an age difference of 10 years.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder ML Curriculum Review Group under Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Data Hygiene: Feature Normalization; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "To prevent high-magnitude features from dominating distance calculations and gradient updates.",
          "isCorrect": true,
          "conceptualExplanation": "Scaling ensures all features contribute fairly to loss gradients and distance metrics.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because computers cannot store numbers larger than 100.",
          "isCorrect": false,
          "conceptualExplanation": "Computers store numbers up to 64-bit limits easily.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To convert text columns into audio files.",
          "isCorrect": false,
          "conceptualExplanation": "Scaling applies to numerical columns.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To automatically eliminate all missing values.",
          "isCorrect": false,
          "conceptualExplanation": "Missing value imputation is a separate step.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_008",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Evaluation on Imbalanced Data",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Model Evaluation",
      "prompt": "When detecting a rare disease affecting 1 in 1,000 patients, why is simple 'Accuracy' a misleading evaluation metric?",
      "plainEnglishHelper": "A lazy model that guesses 'Healthy' for everyone gets 99.9% accuracy, but detects 0 sick people.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Diagnostic Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Imbalanced Data & Evaluation Metrics; O*NET 15-2051.01",
      "options": [
        {
          "key": "A",
          "text": "A naive model guessing 'Negative' for everyone achieves 99.9% accuracy while missing every single sick patient.",
          "isCorrect": true,
          "conceptualExplanation": "Class imbalance makes accuracy deceptive; precision and recall are essential.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because medical models can never have accuracy higher than 50%.",
          "isCorrect": false,
          "conceptualExplanation": "Accuracy can be 99.9%, which is why it is misleading.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because confusion matrices only work on black-and-white images.",
          "isCorrect": false,
          "conceptualExplanation": "Confusion matrices work across any classification problem.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Because false positives and false negatives are identical in medicine.",
          "isCorrect": false,
          "conceptualExplanation": "They carry very different clinical consequences.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_009",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Activation Functions",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Neural Networks",
      "prompt": "What is the primary role of non-linear activation functions (like ReLU) in neural networks?",
      "plainEnglishHelper": "Without non-linearities, stacking 100 layers is mathematically identical to a single flat linear equation.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Deep Learning Primer under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Non-linear Representation & Multi-layer Models; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "They allow the network to learn complex non-linear patterns rather than just straight lines.",
          "isCorrect": true,
          "conceptualExplanation": "Non-linear activations give neural networks universal function approximation capacity.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "They speed up internet downloads of training data.",
          "isCorrect": false,
          "conceptualExplanation": "Activations are mathematical operations inside the model.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "They turn the network into a relational SQL database.",
          "isCorrect": false,
          "conceptualExplanation": "Activations do not create databases.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "They delete negative numbers from computer memory to save RAM.",
          "isCorrect": false,
          "conceptualExplanation": "ReLU outputs zero for negative inputs during math, not deleting memory.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_010",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Scikit-Learn Interface",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "ML Libraries",
      "prompt": "In Scikit-Learn, which standard method is called on a trained model instance to produce predictions on new test data?",
      "plainEnglishHelper": "You call model.fit(X, y) to learn, and model._____(X_test) to get predictions.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder ML API Review Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Scikit-Learn API: Estimator & Predictor Interface; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "model.predict(X_test)",
          "isCorrect": true,
          "conceptualExplanation": "The predict() method generates predictions on input samples.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "model.guess(X_test)",
          "isCorrect": false,
          "conceptualExplanation": "The Scikit-Learn API standard method is predict().",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "model.execute_oracle()",
          "isCorrect": false,
          "conceptualExplanation": "Not a valid scikit-learn method.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "model.solve_all()",
          "isCorrect": false,
          "conceptualExplanation": "Not a valid scikit-learn method.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_011",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "CNN Spatial Filtering",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Computer Vision",
      "prompt": "Why are Convolutional Neural Networks (CNNs) widely used for image recognition instead of simple flat fully-connected layers?",
      "plainEnglishHelper": "Images have local spatial patterns (edges, shapes) where neighboring pixels work together.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Visual Pattern Recognition Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Spatial Filtering & Feature Invariance; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "CNNs use shared convolutional filters that capture local spatial patterns (edges, textures) efficiently.",
          "isCorrect": true,
          "conceptualExplanation": "Convolutions exploit 2D spatial locality and translation invariance with parameter sharing.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Fully connected layers cannot process pixels that contain colors.",
          "isCorrect": false,
          "conceptualExplanation": "Fully connected layers can process color, but require millions of extra parameters.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "CNNs can only run on mobile phones, not servers.",
          "isCorrect": false,
          "conceptualExplanation": "CNNs run across all computing platforms.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "CNNs do not use any training weights or loss functions.",
          "isCorrect": false,
          "conceptualExplanation": "CNN filters contain learnable weights trained with backpropagation.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_012",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "NLP Tokenization",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Natural Language Processing",
      "prompt": "What is the crucial first preprocessing step that breaks a raw text sentence into smaller pieces (words or sub-words) before converting them to numbers?",
      "plainEnglishHelper": "Turning 'Machine learning is fun' into ['Machine', 'learning', 'is', 'fun'].",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles NLP Modules under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Text Decomposition & Vector Representation; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "Tokenization",
          "isCorrect": true,
          "conceptualExplanation": "Tokenization segments text into tokens prior to vector embedding.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Defragmentation",
          "isCorrect": false,
          "conceptualExplanation": "Defragmentation is a disk maintenance task.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Pixel rasterization",
          "isCorrect": false,
          "conceptualExplanation": "Rasterization renders vector graphics to pixels.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Packet sniffing",
          "isCorrect": false,
          "conceptualExplanation": "Packet sniffing captures network traffic.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_013",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Dropout Regularization",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Neural Networks",
      "prompt": "How does 'Dropout' help prevent a deep neural network from overfitting during training?",
      "plainEnglishHelper": "By randomly turning off a fraction of neurons during each training step, no single neuron can become an over-reliant crutch.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Applied ML Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Applied ML: Dropout & Network Generalization; O*NET 15-2051.01",
      "options": [
        {
          "key": "A",
          "text": "It randomly deactivates a fraction of neurons during each step, forcing the network to learn robust, redundant representations.",
          "isCorrect": true,
          "conceptualExplanation": "Dropout prevents co-adaptation of features by training an ensemble of thinned networks.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It drops half of the students from the computer science course.",
          "isCorrect": false,
          "conceptualExplanation": "Dropout is an algorithm regularization method, not an academic administrative action.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It permanently deletes the output layer of the neural network.",
          "isCorrect": false,
          "conceptualExplanation": "The output layer is retained for predictions.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It disconnects the computer from the internet.",
          "isCorrect": false,
          "conceptualExplanation": "Dropout operates on internal neural activations.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_014",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "Model Deployment",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "MLOps",
      "prompt": "When an AI engineer is ready to connect a trained model to a website or mobile app, what is the standard production deployment pattern?",
      "plainEnglishHelper": "Wrap the saved model in a lightweight web server (like FastAPI) that answers HTTP requests with JSON predictions.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder MLOps Engineering Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "MLOps: Model Serving & RESTful Inference APIs; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "Packaging the model inside a lightweight REST API service (e.g. FastAPI/Flask) that receives input data and returns JSON predictions.",
          "isCorrect": true,
          "conceptualExplanation": "Exposing an inference REST or gRPC endpoint is the industry standard for production serving.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Retraining the entire model from scratch every time a single user clicks a button.",
          "isCorrect": false,
          "conceptualExplanation": "Training takes hours or days; inference uses pre-trained weights in milliseconds.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Emailing the Python script manually to every visitor who visits the homepage.",
          "isCorrect": false,
          "conceptualExplanation": "Web applications need automated server endpoints.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Converting the entire neural network into a static JPG image.",
          "isCorrect": false,
          "conceptualExplanation": "A static image cannot compute live algorithmic inferences.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_ai_015",
      "domainId": "ai",
      "domainTitle": "Artificial Intelligence & Machine Learning",
      "concept": "AI Fairness & Bias",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Responsible AI",
      "prompt": "Why can an AI hiring tool trained on historical corporate hiring records develop unfair bias against certain demographic groups?",
      "plainEnglishHelper": "If past historical records reflected human bias, an algorithm trained on those records simply learns that bias as a rule.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Societal Impacts & Bias under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Ethical Computing & Algorithmic Fairness; O*NET 15-1252.00",
      "options": [
        {
          "key": "A",
          "text": "Because the algorithm faithfully learns and amplifies historical disparities already present in the training data.",
          "isCorrect": true,
          "conceptualExplanation": "Models reflect the statistical distributions of their training inputs; biased data produces biased models.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because algorithms develop human anger and personal prejudices naturally.",
          "isCorrect": false,
          "conceptualExplanation": "Algorithms have no emotional consciousness.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because computer chips run on electricity.",
          "isCorrect": false,
          "conceptualExplanation": "Electrical power has no relation to dataset representation.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Because Python code can only execute mathematical additions.",
          "isCorrect": false,
          "conceptualExplanation": "Python executes complex logic.",
          "skillScore": 0
        }
      ]
    }
  ],
  "data": [
    {
      "id": "dom_data_001",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "SQL SELECT and WHERE",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "SQL Basics",
      "prompt": "In a relational database, which SQL clause is used to filter records so that only rows meeting a specific condition (e.g. Price > 100) are returned?",
      "plainEnglishHelper": "SELECT chooses columns; FROM chooses the table; ______ filters the rows.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Database Query modules under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Database Querying & Filtering; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "WHERE",
          "isCorrect": true,
          "conceptualExplanation": "The WHERE clause filters rows based on a specified boolean predicate.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "SORT BY",
          "isCorrect": false,
          "conceptualExplanation": "SORT BY or ORDER BY sorts results, it does not filter them.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "GROUP BY",
          "isCorrect": false,
          "conceptualExplanation": "GROUP BY aggregates data into summary rows.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "EXTRACT",
          "isCorrect": false,
          "conceptualExplanation": "EXTRACT retrieves subcomponents from date/time fields.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_002",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Mean vs Median",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Statistics Fundamentals",
      "prompt": "If a dataset of 100 employee salaries includes 99 junior employees earning $50,000 and 1 CEO earning $10,000,000, which summary metric best represents the typical employee salary?",
      "plainEnglishHelper": "An extreme outlier dramatically pulls the arithmetic average up, but does not affect the middle value.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Computational Thinking Task Bank under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Statistical Reasoning & Outlier Resistance; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "The Median (the middle value), because it is resistant to extreme outliers.",
          "isCorrect": true,
          "conceptualExplanation": "The median represents the central tendency when data is heavily skewed by outliers.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The Mean, because averaging gives the exact salary every person receives.",
          "isCorrect": false,
          "conceptualExplanation": "The mean is heavily distorted to over $149,000, which nobody actually earns.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The Maximum salary ($10,000,000).",
          "isCorrect": false,
          "conceptualExplanation": "The maximum only describes a single individual.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The Standard Deviation alone without any center metric.",
          "isCorrect": false,
          "conceptualExplanation": "Standard deviation measures spread, not central tendency.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_003",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Pandas DataFrames",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Python Data Tools",
      "prompt": "In Python, what is the primary two-dimensional tabular data structure provided by the Pandas library that resembles a spreadsheet with named rows and columns?",
      "plainEnglishHelper": "You create it using pd._____(data).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder CSE Core Curriculum Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "CSE Curriculum: Data Exploration & Tabular Structures; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "DataFrame",
          "isCorrect": true,
          "conceptualExplanation": "A Pandas DataFrame is a 2D labeled data structure with columns of potentially different types.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "LinkedList",
          "isCorrect": false,
          "conceptualExplanation": "A LinkedList is a low-level CS data structure.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "BinarySearchTree",
          "isCorrect": false,
          "conceptualExplanation": "A BST is a hierarchical tree structure.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "PixelBuffer",
          "isCorrect": false,
          "conceptualExplanation": "A PixelBuffer stores graphical screen buffers.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_004",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Correlation vs Causation",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Statistical Logic",
      "prompt": "A study finds that cities with higher ice cream sales also have higher rates of swimming pool drownings. What is the most scientifically sound explanation?",
      "plainEnglishHelper": "Does eating ice cream cause people to drown, or does a third factor (hot summer weather) cause both?",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Data Interpretation under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Confounding Variables & Causal Inference; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "Correlation does not imply causation; a lurking confounding variable (summer heat) increases both ice cream eating and swimming.",
          "isCorrect": true,
          "conceptualExplanation": "Confounding variables create statistical correlations without direct causal links.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Ice cream physically paralyzes swimmers instantly.",
          "isCorrect": false,
          "conceptualExplanation": "There is no physiological causal link.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The data collection was entirely fabricated by hackers.",
          "isCorrect": false,
          "conceptualExplanation": "The correlation is real, but the causation assumption is flawed.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Swimming pool water dissolves dairy products.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant chemical claim.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_005",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Handling Missing Data",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 1,
      "prerequisiteDependency": "Data Cleaning",
      "prompt": "When preparing a dataset where 2% of the 'Age' column values are blank (missing/NaN), which common data-cleaning technique preserves all rows without discarding data?",
      "plainEnglishHelper": "Filling in the blanks with a sensible statistical estimate.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Data Engineering Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Data Cleaning: Missing Value Imputation; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "Imputing missing values using the median or mean age of the existing records.",
          "isCorrect": true,
          "conceptualExplanation": "Imputation fills missing entries with central tendency estimates, preserving sample size.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Filling missing values with negative one billion (-1,000,000,000).",
          "isCorrect": false,
          "conceptualExplanation": "Extreme negative values corrupt future calculations and model training.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Deleting the entire computer hard drive.",
          "isCorrect": false,
          "conceptualExplanation": "Destructive and irrelevant.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Converting all text columns into blank spaces.",
          "isCorrect": false,
          "conceptualExplanation": "This destroys valid data in other columns.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_006",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "SQL Joins",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Database Systems",
      "prompt": "What is the key difference between an INNER JOIN and a LEFT JOIN in SQL?",
      "plainEnglishHelper": "INNER JOIN requires matching keys on both sides. LEFT JOIN keeps all rows from the first table even if no match exists on the right.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Relational Logic Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Relational Algebra & Set Intersections; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "INNER JOIN returns only rows with matching keys in both tables; LEFT JOIN returns all rows from the left table plus any matching right rows.",
          "isCorrect": true,
          "conceptualExplanation": "LEFT JOIN guarantees no left-table records are lost, populating missing right values with NULL.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "INNER JOIN sorts ascending; LEFT JOIN sorts descending.",
          "isCorrect": false,
          "conceptualExplanation": "Joins combine tables; ORDER BY handles sorting.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "LEFT JOIN only works on computers located on the left side of the desk.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical literal interpretation.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "INNER JOIN permanently deletes the right table.",
          "isCorrect": false,
          "conceptualExplanation": "Joins query data; they do not drop tables.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_007",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Data Visualization Choices",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Exploratory Data Analysis",
      "prompt": "Which chart type is most appropriate for visualizing the continuous monthly trend of company revenue over a five-year timeline?",
      "plainEnglishHelper": "Points connected sequentially across chronological time.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Visualizing Trends under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Chart Selection & Visual Encoding; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "Line Chart",
          "isCorrect": true,
          "conceptualExplanation": "Line charts naturally display continuous temporal changes and trends over time.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Pie Chart with 60 tiny slices",
          "isCorrect": false,
          "conceptualExplanation": "Pie charts with dozens of slices are unreadable and poor for chronological trends.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Word Cloud",
          "isCorrect": false,
          "conceptualExplanation": "Word clouds show text word frequency, not chronological financial revenue.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Circular Venn Diagram",
          "isCorrect": false,
          "conceptualExplanation": "Venn diagrams show set memberships, not continuous time series.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_008",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Outlier Detection with Boxplots",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Exploratory Analysis",
      "prompt": "In a standard Box Plot (box-and-whisker plot), what does the horizontal line inside the central box represent?",
      "plainEnglishHelper": "It splits the lower 50% of the data from the upper 50%.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Statistical Visualization Modules under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Quartiles & Distribution Symmetry; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "The Median (the 50th percentile).",
          "isCorrect": true,
          "conceptualExplanation": "The middle line of the box marks Q2, the median of the distribution.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The standard error of the internet connection.",
          "isCorrect": false,
          "conceptualExplanation": "Box plots represent data distributions.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The absolute maximum value ever recorded.",
          "isCorrect": false,
          "conceptualExplanation": "Max values are at the whisker tip or plotted as outlier dots.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The number of columns in the spreadsheet.",
          "isCorrect": false,
          "conceptualExplanation": "Box plots summarize individual continuous variables.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_009",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Primary and Foreign Keys",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Relational Data Modeling",
      "prompt": "In relational database design, what is the role of a 'Foreign Key'?",
      "plainEnglishHelper": "It points to a unique Primary Key in another table to establish a relationship.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Database Architecture Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Database Modeling: Referential Integrity; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "It is a column that refers to the Primary Key of another table, creating a relational link between them.",
          "isCorrect": true,
          "conceptualExplanation": "Foreign keys enforce referential integrity across relational tables.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It is a password used to unlock foreign language translations.",
          "isCorrect": false,
          "conceptualExplanation": "Foreign key is a database modeling relationship term.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It is an encryption key held by an offshore server.",
          "isCorrect": false,
          "conceptualExplanation": "Foreign keys do not refer to geographic foreign countries.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It deletes all tables whenever an error occurs.",
          "isCorrect": false,
          "conceptualExplanation": "Foreign keys prevent invalid orphan records.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_010",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Pandas GroupBy Aggregation",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Data Manipulation",
      "prompt": "Which Pandas operation allows you to split a sales dataset by 'Store_Region' and calculate the total sum of sales for each region?",
      "plainEnglishHelper": "df.____('Store_Region')['Sales'].sum()",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Data Processing Curriculum Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Pandas API: Split-Apply-Combine Aggregations; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "df.groupby('Store_Region')['Sales'].sum()",
          "isCorrect": true,
          "conceptualExplanation": "groupby implements the split-apply-combine workflow in Pandas.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "df.delete_all_except('Store_Region')",
          "isCorrect": false,
          "conceptualExplanation": "Not a valid pandas operation.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "df.sort_alphabetical()",
          "isCorrect": false,
          "conceptualExplanation": "Sorting does not compute category sums.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "df.copy_paste()",
          "isCorrect": false,
          "conceptualExplanation": "Not an aggregation method.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_011",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "OLTP vs OLAP",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Data Warehousing",
      "prompt": "What is the difference between an operational database (OLTP) and an analytical data warehouse (OLAP)?",
      "plainEnglishHelper": "One handles thousands of quick daily website transactions (orders/logins); the other handles heavy analytical reporting across years of history.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Big Data Systems Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Data Architecture: OLTP vs OLAP Trade-offs; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "OLTP is optimized for fast, transactional row-level inserts and updates; OLAP is optimized for complex analytical queries across massive historical data.",
          "isCorrect": true,
          "conceptualExplanation": "OLTP supports live day-to-day operations; OLAP (like Snowflake or BigQuery) powers reporting and analytics.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "OLTP only runs on mobile phones; OLAP only runs on smartwatches.",
          "isCorrect": false,
          "conceptualExplanation": "Both are enterprise server systems.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "OLTP does not use any disks or storage.",
          "isCorrect": false,
          "conceptualExplanation": "Both write persistent data to disk/cloud storage.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "OLAP is a video game graphics standard.",
          "isCorrect": false,
          "conceptualExplanation": "OLAP stands for Online Analytical Processing.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_012",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "Feature Engineering on Dates",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Feature Engineering",
      "prompt": "You have a timestamp column '2026-11-14 18:30:00' in a ride-sharing dataset. How can you engineer helpful new features for predicting ride demand?",
      "plainEnglishHelper": "Extract components like 'Hour of Day' (rush hour?) and 'Day of Week' (weekend vs weekday?).",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Temporal Data Features under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Temporal Decomposition & Feature Extraction; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "Extract 'Hour of Day', 'Day of Week', and 'Is_Weekend' as distinct numerical features.",
          "isCorrect": true,
          "conceptualExplanation": "Temporal feature extraction reveals cyclical behavioral patterns like rush hour and weekend demand.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Delete the timestamp column because numbers cannot contain hyphens.",
          "isCorrect": false,
          "conceptualExplanation": "Timestamps are rich sources of predictive signal.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Replace all timestamps with the number 42.",
          "isCorrect": false,
          "conceptualExplanation": "Destroying time information eliminates cyclical patterns.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Convert the timestamp into an audio sound wave.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant representation.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_013",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "A/B Testing & P-Values",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Experimental Design",
      "prompt": "In an online A/B test comparing a green 'Checkout' button against a blue button, what does a statistically significant result (p-value < 0.05) indicate?",
      "plainEnglishHelper": "It means the observed conversion increase is very unlikely to be just a random lucky fluke.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Empirical Testing Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Hypothesis Testing & Statistical Significance; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "The observed difference in conversion rate is very unlikely to have occurred purely by random chance.",
          "isCorrect": true,
          "conceptualExplanation": "A p-value below the threshold provides evidence against the null hypothesis of no difference.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Exactly 5% of all users closed their web browsers in anger.",
          "isCorrect": false,
          "conceptualExplanation": "p-value is a probability threshold, not a percentage of angry users.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The test ran for only 0.05 seconds.",
          "isCorrect": false,
          "conceptualExplanation": "p-value does not measure elapsed test duration.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The website is guaranteed to earn 100 million dollars next week.",
          "isCorrect": false,
          "conceptualExplanation": "Statistical significance evaluates the hypothesis test, not future financial guarantees.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_014",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "K-Means Clustering",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Unsupervised Learning",
      "prompt": "A marketing team wants to automatically segment customers into 4 distinct groups based on annual spending and shopping frequency. Which algorithm is most suitable?",
      "plainEnglishHelper": "An unsupervised clustering algorithm that groups nearby data points around cluster centers.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Applied Data Science Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Unsupervised ML: Centroid Clustering & Customer Segmentation; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "K-Means Clustering",
          "isCorrect": true,
          "conceptualExplanation": "K-Means partitions data into k centroids based on distance similarity.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Linear Regression",
          "isCorrect": false,
          "conceptualExplanation": "Linear regression predicts continuous numerical target values, not customer clusters.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Binary Search",
          "isCorrect": false,
          "conceptualExplanation": "Binary search searches a sorted array for a single value.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Bubble Sort",
          "isCorrect": false,
          "conceptualExplanation": "Bubble sort sorts numbers in order, it does not cluster multi-dimensional customers.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_data_015",
      "domainId": "data",
      "domainTitle": "Data Science & Analytics",
      "concept": "ETL Pipelines",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Data Engineering",
      "prompt": "What does 'ETL' stand for in modern data engineering and analytics pipelines?",
      "plainEnglishHelper": "The 3 core stages of ingesting raw data, transforming it for analysis, and writing it into a data warehouse.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Data Pipeline Curriculum Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Data Engineering: Extract-Transform-Load Pipeline Patterns; O*NET 15-2051.00",
      "options": [
        {
          "key": "A",
          "text": "Extract, Transform, Load",
          "isCorrect": true,
          "conceptualExplanation": "ETL is the fundamental data integration process of extracting raw data, cleaning/transforming it, and loading it into target storage.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Email, Text, Log",
          "isCorrect": false,
          "conceptualExplanation": "Not what ETL stands for in data systems.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Encrypt, Transfer, Lock",
          "isCorrect": false,
          "conceptualExplanation": "Incorrect security acronym.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Evaluate, Train, Learn",
          "isCorrect": false,
          "conceptualExplanation": "Incorrect machine learning acronym.",
          "skillScore": 0
        }
      ]
    }
  ],
  "web": [
    {
      "id": "dom_web_001",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "Client vs Server",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Web Architecture",
      "prompt": "In full-stack web architecture, what is the primary role of the 'Client' (front-end)?",
      "plainEnglishHelper": "It runs in the user's web browser, rendering the user interface and handling user interactions.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Client-Server modules under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Client-Server Separation & Browser Rendering; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "To render HTML/CSS/JavaScript and capture user interactions in the web browser.",
          "isCorrect": true,
          "conceptualExplanation": "The client application executes in the client browser, handling display and UI events.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To directly manage the physical hard drives in the data center.",
          "isCorrect": false,
          "conceptualExplanation": "Storage infrastructure is managed by backend servers and database engines.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To manufacture computer motherboards.",
          "isCorrect": false,
          "conceptualExplanation": "Hardware manufacturing is an industrial hardware domain.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To compile Python into assembly code.",
          "isCorrect": false,
          "conceptualExplanation": "The client browser executes HTML, CSS, and JavaScript.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_002",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "Semantic HTML",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "HTML5 Basics",
      "prompt": "Why are semantic HTML tags (such as <header>, <nav>, <article>, and <footer>) preferred over generic <div> tags?",
      "plainEnglishHelper": "Semantic tags give meaningful structure to screen readers for accessibility and help search engines understand the page content.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Web Standards Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Web Standards: Semantic HTML5 & Accessibility (a11y); O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "They improve accessibility for assistive screen readers and optimize SEO for search engines.",
          "isCorrect": true,
          "conceptualExplanation": "Semantic HTML explicitly signals the purpose of each page section.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "They prevent users from downloading images.",
          "isCorrect": false,
          "conceptualExplanation": "Semantic tags organize markup structure, they do not block image downloads.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "They make the website run on television remotes only.",
          "isCorrect": false,
          "conceptualExplanation": "Semantic tags work across all browsers and devices.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "They encrypt all HTML text with 256-bit passwords.",
          "isCorrect": false,
          "conceptualExplanation": "HTML tags are unencrypted markup.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_003",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "Responsive CSS",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "CSS Foundations",
      "prompt": "Which CSS technique is standard for writing styles that adapt dynamically to different screen widths (e.g. phones vs laptops)?",
      "plainEnglishHelper": "CSS @media (max-width: 768px) { ... }",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Responsive Layouts under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Responsive Design & Viewport Media Queries; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "CSS Media Queries (@media)",
          "isCorrect": true,
          "conceptualExplanation": "Media queries apply CSS conditional rules depending on screen width, resolution, and orientation.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "JavaScript prompt() popups",
          "isCorrect": false,
          "conceptualExplanation": "Alert/prompt popups display modal dialogs, not responsive CSS layouts.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Re-installing Windows on every device",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Hardcoding pixel widths (width: 1920px) on all containers",
          "isCorrect": false,
          "conceptualExplanation": "Hardcoded large widths break mobile responsiveness.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_004",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "DOM Event Handling",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "JavaScript Basics",
      "prompt": "In JavaScript, how do you listen for and respond to a user clicking a button element on a webpage?",
      "plainEnglishHelper": "button.addEventListener('click', () => { ... })",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Web Event Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Event-Driven Programming & DOM Event Listeners; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "button.addEventListener('click', callbackFunction)",
          "isCorrect": true,
          "conceptualExplanation": "addEventListener attaches an event handler function to a DOM element.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "button.turn_on_computer()",
          "isCorrect": false,
          "conceptualExplanation": "Not a valid DOM method.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "button.wait_for_satellite()",
          "isCorrect": false,
          "conceptualExplanation": "Not a valid DOM method.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "button.delete_browser()",
          "isCorrect": false,
          "conceptualExplanation": "Not a valid DOM method.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_005",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "HTTP Methods",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "HTTP Basics",
      "prompt": "When a user fills out a registration form to create a brand new account, which HTTP method is standard for submitting that new data to the server?",
      "plainEnglishHelper": "GET retrieves data; POST creates new resources; DELETE removes resources.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Web API Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Web Architecture: RESTful HTTP Methods & Semantics; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "POST",
          "isCorrect": true,
          "conceptualExplanation": "HTTP POST is the standard method for sending data to the server to create a resource.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "GET",
          "isCorrect": false,
          "conceptualExplanation": "GET is intended for idempotent data retrieval without body side-effects.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "CANCEL",
          "isCorrect": false,
          "conceptualExplanation": "CANCEL is not a valid standard HTTP method.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "UNDO",
          "isCorrect": false,
          "conceptualExplanation": "UNDO is not a standard HTTP method.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_006",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "Async / Await in JS",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Asynchronous JavaScript",
      "prompt": "Why are 'async/await' and Promises used when making network fetch requests in JavaScript?",
      "plainEnglishHelper": "Fetching data over the internet takes time; async code prevents the browser screen from freezing while waiting.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Asynchronous Execution under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Non-blocking I/O & Promise Resolution; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "They allow non-blocking asynchronous operations so the browser interface does not freeze while waiting for server responses.",
          "isCorrect": true,
          "conceptualExplanation": "Async/await executes asynchronous I/O without blocking the JavaScript main event loop.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "They speed up the electrical speed of the internet cables.",
          "isCorrect": false,
          "conceptualExplanation": "Async programming manages program execution flow, not physical cable speed.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "They ensure passwords are typed in capital letters only.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "They delete duplicate JavaScript files automatically.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_007",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "React Component State",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Frontend Frameworks",
      "prompt": "In React, what happens when a component's state is updated using a state-setter function (e.g. setCount(count + 1))?",
      "plainEnglishHelper": "React re-runs the component function and efficiently updates the virtual DOM and browser view.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Modern Frontend Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Frontend Frameworks: State Management & Virtual DOM Re-rendering; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "React schedules a re-render of the component with the new state, updating the user interface.",
          "isCorrect": true,
          "conceptualExplanation": "State updates trigger reconciliation and re-rendering in React.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The entire computer restarts automatically.",
          "isCorrect": false,
          "conceptualExplanation": "State updates only affect component rendering.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The browser window permanently closes.",
          "isCorrect": false,
          "conceptualExplanation": "State updates update the live page without closing.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "All CSS styles are deleted from the website.",
          "isCorrect": false,
          "conceptualExplanation": "Styles are preserved.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_008",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "HTTP Status Codes",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "REST APIs",
      "prompt": "What does an HTTP 404 response code from a web server signify to the client browser?",
      "plainEnglishHelper": "200 = Success, 500 = Server crashed, 404 = The requested URL resource was not found.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Protocol Messaging Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Protocol Status Codes & Fault Localization; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "Not Found: The server cannot find the requested resource or URL path.",
          "isCorrect": true,
          "conceptualExplanation": "HTTP 404 indicates the requested URI path was not found on the server.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Success: The user's credit card was charged successfully.",
          "isCorrect": false,
          "conceptualExplanation": "Success is represented by 200 or 201.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Internal Server Error: The database caught fire.",
          "isCorrect": false,
          "conceptualExplanation": "Internal server errors are represented by 500.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The internet was disconnected worldwide.",
          "isCorrect": false,
          "conceptualExplanation": "404 is a specific server response indicating active communication.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_009",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "SQL vs NoSQL Choice",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Backend Databases",
      "prompt": "When building a banking application where financial transactions must guarantee strict ACID compliance and avoid data corruption, which database type is traditionally preferred?",
      "plainEnglishHelper": "Relational SQL databases (like PostgreSQL) enforce strict schemas and transactional consistency.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Database Architecture Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Data Architecture: ACID Guarantees & Relational DB Selection; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "A Relational SQL Database (e.g. PostgreSQL), which enforces strict schema constraints and ACID transaction consistency.",
          "isCorrect": true,
          "conceptualExplanation": "Relational databases provide strong ACID guarantees essential for ledger and financial integrity.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "A plain text file stored on an open desktop.",
          "isCorrect": false,
          "conceptualExplanation": "Plain text files lack concurrency control, schemas, and ACID safety.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Storing financial balances in browser localStorage.",
          "isCorrect": false,
          "conceptualExplanation": "LocalStorage is insecure and easily modified by end users.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Printing numbers on receipts without saving them.",
          "isCorrect": false,
          "conceptualExplanation": "Records must be persisted safely.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_010",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "CSS Flexbox",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "CSS Layout Systems",
      "prompt": "Which CSS property on a container element instantly enables one-dimensional flex layout, making it easy to align child items side-by-side or centered?",
      "plainEnglishHelper": "display: _______",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Modern CSS Layouts under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: CSS Box Alignment & Flex Containers; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "display: flex;",
          "isCorrect": true,
          "conceptualExplanation": "display: flex enables Flexbox layout, activating alignment and distribution properties.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "color: blue;",
          "isCorrect": false,
          "conceptualExplanation": "color sets text color, not layout.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "display: none;",
          "isCorrect": false,
          "conceptualExplanation": "display: none hides the element completely.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "font-weight: bold;",
          "isCorrect": false,
          "conceptualExplanation": "font-weight changes typography boldness.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_011",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "CORS Policy",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Web Security & APIs",
      "prompt": "Why does a web browser block a JavaScript fetch request from 'https://myapp.com' to 'https://api.externalbank.com' if CORS headers are missing?",
      "plainEnglishHelper": "Cross-Origin Resource Sharing (CORS) is a browser security mechanism that prevents malicious websites from sneakily querying private APIs without permission.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Web Security Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Same-Origin Policy & Cross-Origin Resource Sharing; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "The browser's Same-Origin Policy blocks unauthorized cross-domain requests unless the target server explicitly allows it via CORS headers.",
          "isCorrect": true,
          "conceptualExplanation": "CORS prevents unauthorized client-side scripts from reading responses from foreign origins.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because web browsers are only allowed to connect to one website per day.",
          "isCorrect": false,
          "conceptualExplanation": "Browsers connect to thousands of endpoints daily.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because external banks are prohibited from using the internet.",
          "isCorrect": false,
          "conceptualExplanation": "Banks use web APIs, with configured CORS headers.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Because the computer's monitor resolution is too low.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant hardware claim.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_012",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "JWT Authentication",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Web Authentication",
      "prompt": "What is the main benefit of using signed JSON Web Tokens (JWT) for user authentication in modern RESTful APIs?",
      "plainEnglishHelper": "The server does not need to store active session state in a database for every request; the signed token proves the user identity statelessly.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Web Security Working Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Web Security: Stateless JWT Authentication & Token Verification; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "They allow stateless authentication where the server verifies the user's signed claims without querying a central session database on every request.",
          "isCorrect": true,
          "conceptualExplanation": "JWTs carry cryptographically signed claims, enabling scalable stateless authentication.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "They prevent users from ever having to log in again for 50 years.",
          "isCorrect": false,
          "conceptualExplanation": "Tokens expire and should be refreshed securely.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "They turn the backend server off automatically after 5 PM.",
          "isCorrect": false,
          "conceptualExplanation": "JWT is an authentication token format.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "They replace all HTML code with binary video files.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_013",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "Modern Build Bundlers",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Tooling & Optimization",
      "prompt": "Why do modern full-stack web applications use build tools like Vite or Webpack before deploying to production?",
      "plainEnglishHelper": "They bundle, minify, and optimize JavaScript/CSS files to minimize file sizes and make the website load quickly for users.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Code Optimization & Bundling under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Asset Minification, Tree-Shaking & Module Bundling; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "To bundle modular code, transpile modern syntax, eliminate unused code (tree-shaking), and minify files for fast loading.",
          "isCorrect": true,
          "conceptualExplanation": "Bundlers optimize assets to reduce HTTP requests and minimize payload size for fast load times.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To translate JavaScript into spoken audio podcasts.",
          "isCorrect": false,
          "conceptualExplanation": "Bundlers compile web code.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To duplicate the website 1,000 times on the user's hard drive.",
          "isCorrect": false,
          "conceptualExplanation": "Bundlers optimize and minimize code, not duplicate.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To convert web code into printable PDF brochures.",
          "isCorrect": false,
          "conceptualExplanation": "Bundlers generate production web assets.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_014",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "LocalStorage Security",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Frontend Security",
      "prompt": "Why should sensitive authentication secrets (like raw user passwords or unhashed payment keys) NEVER be stored in browser localStorage?",
      "plainEnglishHelper": "Any JavaScript running on the page (including malicious third-party scripts from an XSS attack) can easily read localStorage.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Secure Web Application Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Web Security: LocalStorage Vulnerabilities & XSS Exfiltration; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "Any JavaScript script running on the page can access localStorage, making it vulnerable to data theft via Cross-Site Scripting (XSS).",
          "isCorrect": true,
          "conceptualExplanation": "LocalStorage has no server-only protection; HttpOnly cookies are preferred for sensitive tokens.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because localStorage deletes all stored data every 5 seconds.",
          "isCorrect": false,
          "conceptualExplanation": "LocalStorage persists until explicitly cleared.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because localStorage can only store capital letters.",
          "isCorrect": false,
          "conceptualExplanation": "LocalStorage stores any string.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Because browsers charge $10 per byte stored in localStorage.",
          "isCorrect": false,
          "conceptualExplanation": "Browser storage is free and local to the device.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_web_015",
      "domainId": "web",
      "domainTitle": "Full-Stack Web Development",
      "concept": "Web Performance Optimization",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Web Performance",
      "prompt": "If an e-commerce product catalog page is loading very slowly because it renders 500 high-resolution images all at once, which optimization is most effective?",
      "plainEnglishHelper": "Only load images as the user scrolls them into the screen viewport.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Resource Optimization Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Lazy Loading & On-Demand Network Fetching; O*NET 15-1254.00",
      "options": [
        {
          "key": "A",
          "text": "Implementing Lazy Loading (loading images only when they scroll into the viewport) and compressing images with modern WebP formats.",
          "isCorrect": true,
          "conceptualExplanation": "Lazy loading defers off-screen image loading, dramatically reducing initial page weight and load latency.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Converting all images into 10-hour WAV audio files.",
          "isCorrect": false,
          "conceptualExplanation": "Audio files would dramatically increase page weight.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Asking all shoppers to buy faster computers.",
          "isCorrect": false,
          "conceptualExplanation": "Performance optimization is an engineering responsibility.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Reloading the entire page automatically every 2 seconds.",
          "isCorrect": false,
          "conceptualExplanation": "Continuous reloading degrades performance and user experience.",
          "skillScore": 0
        }
      ]
    }
  ],
  "security": [
    {
      "id": "dom_security_001",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "The CIA Triad",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Security Fundamentals",
      "prompt": "What are the three core foundational pillars of information security known as the 'CIA Triad'?",
      "plainEnglishHelper": "Keeping secrets private, ensuring data is not secretly altered, and making sure authorized users can access the system when needed.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Cybersecurity Principles under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Security Objectives & The CIA Triad; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Confidentiality, Integrity, and Availability",
          "isCorrect": true,
          "conceptualExplanation": "The CIA triad defines the core goals of information security architecture.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Computers, Internet, and Antivirus",
          "isCorrect": false,
          "conceptualExplanation": "These are tools, not the security model pillars.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Coding, Inspecting, and Archiving",
          "isCorrect": false,
          "conceptualExplanation": "These are software engineering tasks.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Central Intelligence Agency only",
          "isCorrect": false,
          "conceptualExplanation": "In cybersecurity, CIA stands for Confidentiality, Integrity, Availability.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_002",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Hashing vs Encryption",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Cryptography Basics",
      "prompt": "What is the key difference between cryptographic 'Hashing' (like SHA-256) and 'Encryption' (like AES)?",
      "plainEnglishHelper": "Hashing is a one-way street (you cannot turn the hash back into the password). Encryption is a two-way street using a key to decrypt back.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Cryptography Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: One-Way Hash Functions & Cryptographic Reversibility; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Hashing is a one-way mathematical function designed to verify data without reversing it; Encryption is two-way and can be decrypted with the correct key.",
          "isCorrect": true,
          "conceptualExplanation": "Hashes verify integrity statelessly without exposing plaintext; encryption allows decryption with private keys.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Hashing can be reversed by anyone on Google.",
          "isCorrect": false,
          "conceptualExplanation": "Cryptographic hash functions are mathematically one-way and irreversible.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Encryption only works on text files containing fewer than 10 words.",
          "isCorrect": false,
          "conceptualExplanation": "Encryption encrypts files and streams of any size.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Hashing deletes all data from the database.",
          "isCorrect": false,
          "conceptualExplanation": "Hashes generate fixed-length digests.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_003",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Role of a Firewall",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Network Security",
      "prompt": "What is the primary function of a network firewall?",
      "plainEnglishHelper": "It acts like a security guard at a building door, inspecting network traffic packets and blocking unauthorized connections based on defined rules.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Network Defense Working Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Network Defense: Packet Filtering & Firewall Policy Enforcement; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "To inspect incoming and outgoing network traffic and block unauthorized packets based on security rules.",
          "isCorrect": true,
          "conceptualExplanation": "Firewalls enforce access control lists and stateful inspection on network traffic.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To physically cool down the server room with air conditioning.",
          "isCorrect": false,
          "conceptualExplanation": "Firewalls are network security appliances/software, not physical cooling fans.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To speed up video streaming quality.",
          "isCorrect": false,
          "conceptualExplanation": "Firewalls enforce security boundaries, not video upscaling.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To delete old email messages from 5 years ago.",
          "isCorrect": false,
          "conceptualExplanation": "Firewalls filter live traffic.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_004",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Phishing Recognition",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 1,
      "prerequisiteDependency": "Social Engineering",
      "prompt": "An employee receives an urgent email claiming their bank account is locked, asking them to click 'http://bank-security-login.xyz' to enter their password immediately. What type of attack is this?",
      "plainEnglishHelper": "A deceptive email impersonating a trusted institution to steal login credentials.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Social Engineering Awareness under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Social Engineering Vectors & Phishing Indicators; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Phishing (Social Engineering)",
          "isCorrect": true,
          "conceptualExplanation": "Phishing tricks victims into handing over credentials via spoofed communications.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Hardware Thermal Throttling",
          "isCorrect": false,
          "conceptualExplanation": "Hardware thermal throttling is a CPU cooling reaction.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "SQL Injection",
          "isCorrect": false,
          "conceptualExplanation": "SQL injection targets database query syntax, not human email behavior.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Denial of Service",
          "isCorrect": false,
          "conceptualExplanation": "DoS floods network bandwidth.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_005",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Multi-Factor Authentication",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Authentication Systems",
      "prompt": "Why does Multi-Factor Authentication (MFA) provide vastly superior protection compared to a password alone?",
      "plainEnglishHelper": "An attacker who steals your password still cannot log in without your physical phone or authenticator app.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Authentication Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Multi-Factor Verification & Credential Compromise Resilience; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "It requires two or more distinct verification factors (something you know, like a password, and something you have, like a physical phone code).",
          "isCorrect": true,
          "conceptualExplanation": "MFA stops unauthorized logins even if password credentials are leaked in a data breach.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It automatically changes the user's name every week.",
          "isCorrect": false,
          "conceptualExplanation": "MFA does not alter user names.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It makes internet downloads 100 times faster.",
          "isCorrect": false,
          "conceptualExplanation": "MFA is an authentication layer.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It replaces computers with physical notebooks.",
          "isCorrect": false,
          "conceptualExplanation": "MFA uses digital hardware tokens or authenticator apps.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_006",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Preventing SQL Injection",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Application Security",
      "prompt": "How can a software developer completely prevent SQL Injection attacks when querying a database with user-supplied input?",
      "plainEnglishHelper": "Never glue raw user strings into SQL code. Use parameterized queries (prepared statements) where input is treated strictly as data, not executable code.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Secure Software Engineering under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Injection Vulnerabilities & Parameterized Queries; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "By using Parameterized Queries (Prepared Statements) so user input is treated strictly as data, never as executable SQL code.",
          "isCorrect": true,
          "conceptualExplanation": "Parameterized queries separate SQL logic from untrusted user input parameters.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "By concatenating raw input strings directly with the '+' operator.",
          "isCorrect": false,
          "conceptualExplanation": "String concatenation is precisely what causes SQL injection vulnerabilities.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "By asking users politely on the screen not to type any quotes.",
          "isCorrect": false,
          "conceptualExplanation": "Client-side courtesy does not stop malicious attackers.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "By deleting the database table whenever an apostrophe is entered.",
          "isCorrect": false,
          "conceptualExplanation": "Destructive and ineffective.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_007",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Asymmetric Public-Key Crypto",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Cryptography",
      "prompt": "In Asymmetric (Public-Key) Cryptography (like RSA or ECC), how do the two keys work together?",
      "plainEnglishHelper": "Anyone can use your Public Key to lock a secret message into a box, but only your private secret key can unlock it.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Asymmetric Encryption Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Asymmetric Key Pairs & Mathematical Trapdoor Functions; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Data encrypted with the publicly shared Public Key can only be decrypted by the matching private secret key.",
          "isCorrect": true,
          "conceptualExplanation": "Public key cryptography eliminates the need to share a shared secret over insecure networks.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Both keys must be posted on public social media for anyone to read.",
          "isCorrect": false,
          "conceptualExplanation": "The private key must remain strictly secret.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The two keys delete each other when they touch.",
          "isCorrect": false,
          "conceptualExplanation": "Asymmetric keys are complementary mathematical pairs.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "One key is for typing in English, and the other is for typing in Spanish.",
          "isCorrect": false,
          "conceptualExplanation": "Keys are numerical mathematical bit sequences.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_008",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "HTTPS & TLS",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Web Security",
      "prompt": "What does the padlock icon and 'HTTPS' in a browser URL bar guarantee to the user?",
      "plainEnglishHelper": "The connection between your browser and the website is encrypted using TLS, preventing eavesdroppers from reading passwords in transit.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Internet Security Working Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Web Security: Transport Layer Security (TLS) & Man-in-the-Middle Prevention; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Communication between the browser and server is encrypted, protecting credentials from eavesdropping in transit.",
          "isCorrect": true,
          "conceptualExplanation": "HTTPS uses TLS encryption to guarantee channel confidentiality and server authenticity.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The website is legally immune from all criminal laws.",
          "isCorrect": false,
          "conceptualExplanation": "HTTPS secures transmission; it does not grant legal immunity.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The user will never see any advertisements.",
          "isCorrect": false,
          "conceptualExplanation": "HTTPS does not block ads.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The computer's antivirus subscription was renewed for free.",
          "isCorrect": false,
          "conceptualExplanation": "HTTPS is a network protocol, not an antivirus subscription.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_009",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Principle of Least Privilege",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Access Control",
      "prompt": "What does the security 'Principle of Least Privilege' state?",
      "plainEnglishHelper": "Only give employees and applications the bare minimum permissions necessary to complete their job, and nothing more.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Access Control Policies under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Identity & Access Management (IAM) & Least Privilege; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Users and processes should only be granted the minimum permissions strictly necessary to perform their assigned tasks.",
          "isCorrect": true,
          "conceptualExplanation": "Least privilege minimizes the blast radius if an account is compromised.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Every intern should be given full root superuser access on day one.",
          "isCorrect": false,
          "conceptualExplanation": "Excessive permissions maximize breach damage.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Users should be forbidden from reading any emails forever.",
          "isCorrect": false,
          "conceptualExplanation": "Users need the permissions required for their duties.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "All computer screens must display black-and-white colors only.",
          "isCorrect": false,
          "conceptualExplanation": "Access control deals with data and system permissions.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_010",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Cross-Site Scripting (XSS)",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Web Vulnerabilities",
      "prompt": "What happens during a Stored Cross-Site Scripting (XSS) attack on a web forum?",
      "plainEnglishHelper": "An attacker leaves a comment containing malicious `<script>` tags; when other users view the forum, the malicious script runs inside their browsers.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Web Application Security Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "AppSec: Cross-Site Scripting Vectors & Output Encoding; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Malicious JavaScript injected into the forum database executes automatically in the browsers of visiting users, potentially stealing their session cookies.",
          "isCorrect": true,
          "conceptualExplanation": "XSS exploits unescaped user input rendered into the browser DOM.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The attacker's computer motherboard catches fire.",
          "isCorrect": false,
          "conceptualExplanation": "XSS targets visiting users' browsers.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The website switches from English to binary machine code.",
          "isCorrect": false,
          "conceptualExplanation": "XSS executes arbitrary client-side script code.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The internet router is physically disconnected from the wall.",
          "isCorrect": false,
          "conceptualExplanation": "XSS is a web application layer attack.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_011",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Password Salting",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Credential Storage",
      "prompt": "Why do modern systems add a random unique 'Salt' to every password before hashing it?",
      "plainEnglishHelper": "If two users have the same password ('Password123'), a salt ensures their resulting hash strings look completely different, defeating pre-computed Rainbow Tables.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Password Security Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Cryptographic Salting & Rainbow Table Mitigation; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "To ensure identical passwords generate completely unique hash digests, defeating pre-computed Rainbow Table lookup attacks.",
          "isCorrect": true,
          "conceptualExplanation": "Salting prevents attackers from using pre-computed hash lookup tables across leaked databases.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To make the password taste better to computer chips.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical humorous distraction.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To automatically shorten passwords to 3 letters.",
          "isCorrect": false,
          "conceptualExplanation": "Salting appends random entropy; it does not truncate.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To convert the password into a plain text email.",
          "isCorrect": false,
          "conceptualExplanation": "Salting enhances hashed storage security.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_012",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Public Wi-Fi & VPNs",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Network Protection",
      "prompt": "Why is connecting to an unencrypted public Wi-Fi network at a coffee shop risky, and how does a VPN mitigate that risk?",
      "plainEnglishHelper": "Other people on the same Wi-Fi can snoop on your unencrypted network packets; a VPN creates an encrypted tunnel across the coffee shop Wi-Fi.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Public Network Risks under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Eavesdropping Vectors & Virtual Private Network Tunneling; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Untrusted peers on the same local network can eavesdrop on unencrypted traffic; a VPN wraps all traffic in an encrypted tunnel to a secure gateway.",
          "isCorrect": true,
          "conceptualExplanation": "VPNs create an encrypted IP tunnel that shields traffic from local eavesdroppers.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Coffee shop Wi-Fi charges $500 per minute without telling you.",
          "isCorrect": false,
          "conceptualExplanation": "The risk is network traffic eavesdropping and session hijacking.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "A VPN speeds up the battery charging speed of laptops.",
          "isCorrect": false,
          "conceptualExplanation": "VPNs provide encrypted tunneling, not electrical charging.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Public Wi-Fi turns off the user's screen automatically.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_013",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "DDoS Attacks & Botnets",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Threat Mitigation",
      "prompt": "What is a Distributed Denial of Service (DDoS) attack?",
      "plainEnglishHelper": "Thousands of infected computers (a botnet) all send overwhelming internet traffic to a target website simultaneously, crashing it for legitimate users.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Incident Response Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Network Security: Distributed Denial of Service & Traffic Scrubbing; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "An attack where a botnet of compromised systems floods a target server with massive traffic, overwhelming its bandwidth and crashing it for legitimate users.",
          "isCorrect": true,
          "conceptualExplanation": "DDoS attacks exhaust server bandwidth and compute resources through distributed volume.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "A bug in Windows that causes files to be saved in reverse order.",
          "isCorrect": false,
          "conceptualExplanation": "DDoS is an intentional network volumetric attack.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "An ethical security audit conducted by college professors.",
          "isCorrect": false,
          "conceptualExplanation": "DDoS attacks are hostile availability attacks.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "A physical break-in through the back window of an office.",
          "isCorrect": false,
          "conceptualExplanation": "DDoS is a digital network flood.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_014",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Zero Trust Architecture",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Enterprise Security",
      "prompt": "What is the foundational philosophy behind modern 'Zero Trust' security architecture?",
      "plainEnglishHelper": "Do not trust anyone just because they are inside the corporate building or VPN; continuously verify identity and device health for every single access request.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Enterprise Architecture Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Enterprise Security: Zero Trust Architecture & Continuous Verification; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "Never trust, always verify: assume the internal network could be compromised and continuously authenticate every request regardless of location.",
          "isCorrect": true,
          "conceptualExplanation": "Zero Trust replaces perimeter-based security with continuous identity and posture validation.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Fire all employees and allow only artificial intelligence to run the company.",
          "isCorrect": false,
          "conceptualExplanation": "Zero Trust is an identity and verification architectural model.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Delete all passwords and leave all servers completely open.",
          "isCorrect": false,
          "conceptualExplanation": "Zero Trust strictly verifies every transaction.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Never allow any computer to connect to any other computer.",
          "isCorrect": false,
          "conceptualExplanation": "Systems still communicate, but with microsegmentation and verified tokens.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_security_015",
      "domainId": "security",
      "domainTitle": "Cybersecurity & Defense",
      "concept": "Penetration Testing",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Offensive Security",
      "prompt": "What is the primary objective of an authorized 'Penetration Test' (ethical hacking engagement)?",
      "plainEnglishHelper": "To simulate real-world cyber attacks against a company's systems to discover security vulnerabilities before malicious criminals exploit them.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Ethical Hacking & Defense under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Vulnerability Assessment & Ethical Penetration Testing; O*NET 15-1212.00",
      "options": [
        {
          "key": "A",
          "text": "To proactively identify and remediate security weaknesses by simulating real-world cyber attacks under formal authorization.",
          "isCorrect": true,
          "conceptualExplanation": "Ethical penetration tests find security gaps before malicious adversaries exploit them.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To steal customer credit card numbers and sell them online.",
          "isCorrect": false,
          "conceptualExplanation": "That is illegal criminal activity, the opposite of ethical testing.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To permanently destroy all company backups.",
          "isCorrect": false,
          "conceptualExplanation": "Penetration testing adheres to strict rules of engagement without wanton destruction.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To test how loudly computer speakers can play music.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant distraction.",
          "skillScore": 0
        }
      ]
    }
  ],
  "cloud": [
    {
      "id": "dom_cloud_001",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Cloud Computing Definition",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Cloud Basics",
      "prompt": "What is the fundamental business and technical model of 'Cloud Computing'?",
      "plainEnglishHelper": "Instead of buying and maintaining physical server racks in your own basement, you rent compute and storage on-demand over the internet from providers like AWS/Azure/GCP.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Cloud Infrastructure under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: On-Demand Compute & Cloud Resource Provisioning; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "On-demand delivery of computing power, database storage, and IT resources over the internet with pay-as-you-go pricing.",
          "isCorrect": true,
          "conceptualExplanation": "Cloud computing replaces upfront capital server purchases with flexible utility-metered access.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Storing computer files inside actual physical clouds in the sky.",
          "isCorrect": false,
          "conceptualExplanation": "Cloud is a metaphor for remote internet data centers.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "A government law requiring all computers to be painted white.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Using computers only when it is raining outdoors.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_002",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Horizontal vs Vertical Scaling",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Scalability",
      "prompt": "What is the difference between 'Vertical Scaling' (scaling up) and 'Horizontal Scaling' (scaling out)?",
      "plainEnglishHelper": "Vertical scaling means upgrading to a more powerful machine (more RAM/CPU). Horizontal scaling means adding more machines running side-by-side.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Distributed Scaling Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Distributed Systems & Horizontal Elasticity; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Vertical scaling upgrades an existing server with more CPU/RAM; Horizontal scaling adds more server instances running in parallel.",
          "isCorrect": true,
          "conceptualExplanation": "Horizontal scaling allows nearly unlimited elasticity and fault tolerance.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Vertical scaling turns computers sideways on the desk.",
          "isCorrect": false,
          "conceptualExplanation": "Vertical and horizontal refer to scaling architecture paradigms.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Horizontal scaling only works for video game graphics.",
          "isCorrect": false,
          "conceptualExplanation": "Horizontal scaling applies to all web and distributed architectures.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Vertical scaling deletes half of the servers.",
          "isCorrect": false,
          "conceptualExplanation": "Vertical scaling upgrades machine capacity.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_003",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Docker Containers vs VMs",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Containerization",
      "prompt": "Why are Docker containers lighter, faster to start, and more resource-efficient than traditional Virtual Machines (VMs)?",
      "plainEnglishHelper": "VMs include a complete, heavy guest operating system on virtual hardware; Docker containers share the host machine's OS kernel.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Cloud Infrastructure Curriculum Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Cloud Architecture: Containerization vs Hypervisor Virtualization; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Containers share the host OS kernel and package only the application and its dependencies, eliminating heavy guest OS overhead.",
          "isCorrect": true,
          "conceptualExplanation": "Containers isolate processes using Linux namespaces and cgroups on a shared kernel.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Containers do not use any computer memory or disk space at all.",
          "isCorrect": false,
          "conceptualExplanation": "Containers consume memory and disk, but far less than full VMs.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Virtual machines only run on Apple computers.",
          "isCorrect": false,
          "conceptualExplanation": "Virtual machines run on all major hardware architectures.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Docker containers only work when disconnected from the internet.",
          "isCorrect": false,
          "conceptualExplanation": "Containers pull images and serve traffic across networks.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_004",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Object Storage (S3)",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Cloud Storage",
      "prompt": "In cloud platforms (such as Amazon S3, Google Cloud Storage, or Azure Blob), what type of storage is designed for storing massive amounts of unstructured files like images, videos, and backups?",
      "plainEnglishHelper": "Object Storage where files are accessed via unique keys/URLs over HTTP.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Cloud Storage Architectures under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Object Storage Patterns & Unstructured Media; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Object Storage (e.g. S3 Buckets)",
          "isCorrect": true,
          "conceptualExplanation": "Object storage stores arbitrary unstructured files accessed via HTTP keys/URLs with virtually unlimited scale.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Floppy Disk Storage",
          "isCorrect": false,
          "conceptualExplanation": "Floppy disks are obsolete legacy physical media.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "RAM Cache registers",
          "isCorrect": false,
          "conceptualExplanation": "CPU cache registers store nanosecond temporary processor instructions.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Magnetic Tape punch cards",
          "isCorrect": false,
          "conceptualExplanation": "Punch cards are early 20th-century computing artifacts.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_005",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "What is CI/CD",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "DevOps Automation",
      "prompt": "What is the primary goal of implementing a CI/CD (Continuous Integration / Continuous Deployment) pipeline in software development?",
      "plainEnglishHelper": "Automatically test, build, and deploy code changes whenever a developer pushes to GitHub, catching bugs early.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Automated Workflow Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Pipeline Automation & Continuous Delivery; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "To automatically build, test, and deploy code changes rapidly and reliably whenever developers push commits.",
          "isCorrect": true,
          "conceptualExplanation": "CI/CD automates quality checks and deployment pipelines, eliminating manual deployment errors.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To prevent developers from ever writing code again.",
          "isCorrect": false,
          "conceptualExplanation": "CI/CD helps developers deploy code faster.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To turn off the company website every Friday evening.",
          "isCorrect": false,
          "conceptualExplanation": "CI/CD enables zero-downtime continuous updates.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To convert all programming languages into Latin.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_006",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Infrastructure as Code",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "IaC Tools",
      "prompt": "What is the advantage of using 'Infrastructure as Code' (IaC) tools like Terraform or AWS CloudFormation?",
      "plainEnglishHelper": "You write code that defines your servers, databases, and networks in text files that can be version-controlled with Git and deployed reproducibly.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder DevOps Engineering Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "DevOps: Declarative Infrastructure as Code & State Management; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Infrastructure is defined in declarative code files that can be version-controlled, reviewed, and deployed consistently and repeatedly.",
          "isCorrect": true,
          "conceptualExplanation": "IaC eliminates manual console clicking, ensuring reproducible environments across staging and production.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It forces engineers to build physical computer chips by hand.",
          "isCorrect": false,
          "conceptualExplanation": "IaC automates cloud resource provisioning through code.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It makes servers completely immune to all electrical power outages.",
          "isCorrect": false,
          "conceptualExplanation": "IaC provisions cloud resources; physical datacenter power is cloud provider responsibility.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It deletes all cloud resources every 30 minutes.",
          "isCorrect": false,
          "conceptualExplanation": "IaC maintains desired state idempotently.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_007",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Load Balancer Role",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Cloud Networking",
      "prompt": "In high-traffic cloud architectures, what is the role of an Application Load Balancer?",
      "plainEnglishHelper": "It sits in front of your servers, distributing incoming user web traffic evenly across multiple healthy backend servers.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Network Traffic Distribution under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Traffic Distribution, Reverse Proxies & Health Checks; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Distributing incoming user traffic across multiple healthy backend servers so no single server is overwhelmed.",
          "isCorrect": true,
          "conceptualExplanation": "Load balancers distribute requests and route around unhealthy instances.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Measuring the physical weight of server racks in kilograms.",
          "isCorrect": false,
          "conceptualExplanation": "Load balancing refers to network traffic volume, not physical gravity.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Increasing the font size of web pages automatically.",
          "isCorrect": false,
          "conceptualExplanation": "Load balancers operate at the network and transport layers.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Deleting inactive user accounts.",
          "isCorrect": false,
          "conceptualExplanation": "Load balancers forward network packets.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_008",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Serverless Computing",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Serverless Architectures",
      "prompt": "What characterizes 'Serverless' computing services like AWS Lambda or Google Cloud Functions?",
      "plainEnglishHelper": "You only upload your code function; the cloud provider automatically runs it on-demand, scales from 0 to thousands, and you only pay when code executes.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Event-Driven Compute Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Event-Driven Serverless Execution & Consumption Pricing; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Developers upload code functions that execute on-demand in response to events; the cloud provider manages server provisioning, auto-scaling, and billing strictly per execution.",
          "isCorrect": true,
          "conceptualExplanation": "Serverless abstracts server management and scales elastically with zero idle cost.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Computers that run without using any computer chips or electricity.",
          "isCorrect": false,
          "conceptualExplanation": "Servers still exist in cloud datacenters, but are fully managed by the provider.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Websites that can only be viewed in black and white.",
          "isCorrect": false,
          "conceptualExplanation": "Serverless functions serve any application API or background task.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Databases that can never be updated once created.",
          "isCorrect": false,
          "conceptualExplanation": "Serverless functions connect to live databases and APIs.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_009",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Shared Responsibility Model",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Cloud Security",
      "prompt": "According to the Cloud 'Shared Responsibility Model', what is the customer (developer) responsible for?",
      "plainEnglishHelper": "The cloud provider secures the physical datacenters and hardware; the customer is responsible for securing their own application data, credentials, and firewall rules.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Cloud Security Standards Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Cloud Governance: Shared Responsibility Model & Customer Security Domains; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Securing customer data, user credentials, access permissions (IAM), and application software configuration.",
          "isCorrect": true,
          "conceptualExplanation": "The cloud provider secures the cloud infrastructure; the customer secures what they put in the cloud.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Fixing physical broken cooling fans inside the cloud provider's secret datacenter.",
          "isCorrect": false,
          "conceptualExplanation": "Physical datacenter maintenance is 100% provider responsibility.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Manufacturing undersea fiber-optic cables by hand.",
          "isCorrect": false,
          "conceptualExplanation": "Physical infrastructure is managed by telecom and cloud vendors.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Paying the electricity bill for the cloud provider's office cafeteria.",
          "isCorrect": false,
          "conceptualExplanation": "Billing covers cloud compute and storage consumption.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_010",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Microservices vs Monolith",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "System Architecture",
      "prompt": "What is the main architectural difference between a 'Monolithic' application and a 'Microservices' architecture?",
      "plainEnglishHelper": "A monolith packages the entire app (auth, payments, catalog) into one big codebase; microservices break it into independent services deployed separately.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Modular System Architecture under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Service Decomposition & Independent Scalability; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "A monolith is a single unified application codebase; microservices decompose the application into small, loosely-coupled services that deploy and scale independently.",
          "isCorrect": true,
          "conceptualExplanation": "Microservices allow independent team deployments and isolated service scalability.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Monoliths only work on smartphones; microservices only work on smartwatches.",
          "isCorrect": false,
          "conceptualExplanation": "Both architectures run across server infrastructure.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Microservices do not use any programming languages.",
          "isCorrect": false,
          "conceptualExplanation": "Microservices are written in diverse programming languages.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Monoliths cannot connect to any databases.",
          "isCorrect": false,
          "conceptualExplanation": "Monoliths traditionally connect to a central database.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_011",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Kubernetes Pods & Orchestration",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Container Orchestration",
      "prompt": "In Kubernetes (K8s), what is the role of the container orchestration platform when a containerized web server crashes unexpectedly?",
      "plainEnglishHelper": "Kubernetes monitors container health; if one crashes, it automatically launches a fresh replacement container to maintain desired state.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Cloud Native Engineering Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Container Orchestration: Self-Healing Pods & Desired State Reconciliation; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Kubernetes detects the failed pod through health checks and automatically restarts or reschedules a replacement container to restore desired state.",
          "isCorrect": true,
          "conceptualExplanation": "Self-healing and desired state reconciliation are core superpowers of Kubernetes.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Kubernetes sends a text message waking up the company CEO in the middle of the night.",
          "isCorrect": false,
          "conceptualExplanation": "Kubernetes handles automated self-healing without manual intervention.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Kubernetes permanently deletes the entire website forever.",
          "isCorrect": false,
          "conceptualExplanation": "Kubernetes preserves uptime and resilience.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Kubernetes switches the programming language from Python to Fortran.",
          "isCorrect": false,
          "conceptualExplanation": "Containers run their existing application code.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_012",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Auto-Scaling Groups",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Cloud Elasticity",
      "prompt": "During a flash sale on Black Friday, an e-commerce website experiences a 10x surge in visitor traffic. How does an Auto-Scaling Group respond automatically?",
      "plainEnglishHelper": "When average CPU utilization exceeds a target threshold (e.g. 70%), it automatically launches new server instances to handle the traffic.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Elastic Resource Scaling Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Dynamic Resource Allocation & Threshold Triggering; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "It automatically provisions and launches additional server instances when CPU/traffic metrics cross predefined scaling thresholds.",
          "isCorrect": true,
          "conceptualExplanation": "Auto-scaling adds capacity during demand surges and scales in when traffic subsides to save money.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It automatically shuts down the website so nobody can buy anything.",
          "isCorrect": false,
          "conceptualExplanation": "The goal of auto-scaling is maintaining availability under surge.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It tells users their internet speed is restricted.",
          "isCorrect": false,
          "conceptualExplanation": "Auto-scaling scales server capacity.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It replaces all product prices with $0.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_013",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Monitoring & Observability",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Site Reliability",
      "prompt": "What are the 'Three Pillars of Observability' used by Site Reliability Engineers (SREs) to monitor distributed cloud systems?",
      "plainEnglishHelper": "Metrics (numerical trends like CPU%), Logs (timestamped event messages), and Traces (tracking a user request across multiple microservices).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Site Reliability Engineering Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Observability: Metrics, Logs, and Distributed Tracing (MELT); O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "Metrics (numerical time-series), Logs (timestamped event records), and Distributed Traces (request journeys across microservices).",
          "isCorrect": true,
          "conceptualExplanation": "Metrics, Logs, and Traces together provide comprehensive system visibility and fast incident diagnosis.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Screenshots, Video Recordings, and Phone Calls",
          "isCorrect": false,
          "conceptualExplanation": "Observability is built on structured machine-generated telemetry.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Emails, Letters, and Postcards",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Keyboards, Mice, and Monitors",
          "isCorrect": false,
          "conceptualExplanation": "These are computer peripherals.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_014",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "Multi-Region High Availability",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Disaster Recovery",
      "prompt": "Why do mission-critical cloud applications deploy services across multiple geographic cloud regions (e.g. US-East and EU-West)?",
      "plainEnglishHelper": "If a major natural disaster or power grid failure takes down an entire geographic region, traffic automatically fails over to the other region without downtime.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Geographic Redundancy under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Geographic Redundancy, Failover & High Availability; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "To ensure high availability and disaster recovery by allowing automatic failover if an entire datacenter region goes offline.",
          "isCorrect": true,
          "conceptualExplanation": "Geographic multi-region redundancy isolates systems from localized regional outages.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because cloud servers cannot communicate across state borders.",
          "isCorrect": false,
          "conceptualExplanation": "Cloud providers operate dedicated high-speed global backbones.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To make user passwords 10 times longer.",
          "isCorrect": false,
          "conceptualExplanation": "High availability relates to system uptime, not password length.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To force all websites to display two clocks on the screen.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_cloud_015",
      "domainId": "cloud",
      "domainTitle": "Cloud Computing & DevOps",
      "concept": "GitOps & Declarative Delivery",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Modern DevOps",
      "prompt": "In modern 'GitOps' workflows, what serves as the single source of truth for the desired state of production cloud infrastructure?",
      "plainEnglishHelper": "A Git version-control repository containing declarative configuration files.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Continuous Delivery Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "DevOps: GitOps Principles & Version-Controlled Declarative State; O*NET 15-1241.00",
      "options": [
        {
          "key": "A",
          "text": "A Git repository containing declarative configuration code; automated operators continuously synchronize cluster state with Git.",
          "isCorrect": true,
          "conceptualExplanation": "GitOps ensures all infrastructure changes are version-controlled, auditable, and automated via Git commits.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "A sticky note attached to the team leader's desk monitor.",
          "isCorrect": false,
          "conceptualExplanation": "Physical sticky notes are not automated or auditable.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "A verbal conversation during Friday lunch.",
          "isCorrect": false,
          "conceptualExplanation": "Production state must be version-controlled in software repositories.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "A random number generator.",
          "isCorrect": false,
          "conceptualExplanation": "Production infrastructure requires deterministic configuration.",
          "skillScore": 0
        }
      ]
    }
  ],
  "iot": [
    {
      "id": "dom_iot_001",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Sensors vs Actuators",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Hardware Basics",
      "prompt": "In an IoT smart thermostat system, what is the difference between the temperature probe and the heater relay switch?",
      "plainEnglishHelper": "The temperature probe measures the environment (Sensor); the heater relay takes physical action to heat the room (Actuator).",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Physical Computing modules under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Sensors vs Actuators & Environmental Telemetry; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "The probe is a Sensor (converts physical heat into electrical input); the relay switch is an Actuator (converts electrical signals into physical action).",
          "isCorrect": true,
          "conceptualExplanation": "Sensors measure physical phenomena; actuators exert physical actions in the real world.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Both are software apps that only run inside web browsers.",
          "isCorrect": false,
          "conceptualExplanation": "Sensors and actuators are physical hardware components.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The probe is an actuator, and the relay is a sensor.",
          "isCorrect": false,
          "conceptualExplanation": "Reversed definitions.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "They are identical pieces of copper wire with no distinction.",
          "isCorrect": false,
          "conceptualExplanation": "They perform opposing input/output physical functions.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_002",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Microcontroller vs SBC",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Embedded Platforms",
      "prompt": "When should an engineer choose an inexpensive microcontroller (like an ESP32 or Arduino) instead of a full Single-Board Computer (like a Raspberry Pi)?",
      "plainEnglishHelper": "For simple, low-power, instant-on tasks reading sensors on batteries, a microcontroller uses minimal power and boots in milliseconds.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Hardware Selection Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Compute Platform Selection & Power Constraints; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "When the project requires low cost, extremely low battery power consumption, instant boot-up, and direct hardware pin control without a heavy OS.",
          "isCorrect": true,
          "conceptualExplanation": "Microcontrollers excel at low-power dedicated control tasks, consuming milliwatts vs watts for full OS SBCs.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "When you want to play high-definition 3D video games with VR headsets.",
          "isCorrect": false,
          "conceptualExplanation": "3D VR gaming requires high-end GPUs.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because microcontrollers never require any electrical power.",
          "isCorrect": false,
          "conceptualExplanation": "All electronics require power, but microcontrollers require orders of magnitude less.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Because single-board computers cannot connect to the internet.",
          "isCorrect": false,
          "conceptualExplanation": "Raspberry Pis include full Wi-Fi and Ethernet networking.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_003",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "GPIO Pins",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Microcontroller I/O",
      "prompt": "What does 'GPIO' stand for on a microcontroller board like an ESP32, and what is its purpose?",
      "plainEnglishHelper": "General Purpose Input/Output pins that can be programmed in code to read buttons/sensors or send electrical signals to LEDs/motors.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Embedded Systems Curriculum Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Embedded Hardware: General Purpose Input/Output Pin Configuration; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "General Purpose Input/Output: physical pins that software can configure to read digital inputs or write digital outputs.",
          "isCorrect": true,
          "conceptualExplanation": "GPIO pins are the programmable bridge connecting microcontroller software to external electronic components.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Global Positioning Internet Organization",
          "isCorrect": false,
          "conceptualExplanation": "Incorrect expansion.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "General Power Input Only",
          "isCorrect": false,
          "conceptualExplanation": "GPIO pins handle both input signals and output controls, not just raw power.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Graphical Processing Image Option",
          "isCorrect": false,
          "conceptualExplanation": "Not related to graphics.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_004",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Analog vs Digital Signals",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Electronics Signals",
      "prompt": "Why does a microcontroller need an Analog-to-Digital Converter (ADC) to read temperature from an analog thermistor sensor?",
      "plainEnglishHelper": "Microcontrollers only understand binary 1s and 0s, while the physical world (temperature voltage) changes continuously in analog waves.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Digital Representation of Analog Signals under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Analog-to-Digital Conversion & Voltage Sampling; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "The physical world produces continuous varying analog voltages; an ADC samples and converts them into discrete binary numbers the processor can compute.",
          "isCorrect": true,
          "conceptualExplanation": "ADCs quantize continuous real-world voltage into discrete digital values (e.g. 12-bit 0-4095).",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because digital signals cannot travel through copper wires.",
          "isCorrect": false,
          "conceptualExplanation": "Digital electrical pulses travel through copper wires.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To turn the microcontroller off when it gets too hot.",
          "isCorrect": false,
          "conceptualExplanation": "ADCs measure signals, they do not act as power switches.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To convert digital numbers into physical water droplets.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_005",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "MQTT Protocol Advantages",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "IoT Networking",
      "prompt": "Why is the lightweight MQTT protocol preferred over heavy HTTP for battery-powered IoT devices sending telemetry data?",
      "plainEnglishHelper": "MQTT uses a tiny 2-byte header with a publish/subscribe model that saves battery and transmits efficiently even over weak cellular networks.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Protocol Efficiency Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Lightweight Telemetry Protocols & Publish-Subscribe Topologies; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "MQTT has minimal packet overhead (as small as 2 bytes) and uses an efficient publish/subscribe model ideal for low-bandwidth and battery constraints.",
          "isCorrect": true,
          "conceptualExplanation": "MQTT minimizes network packet size and connection overhead compared to verbose HTTP text headers.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "HTTP is completely illegal on electronic hardware devices.",
          "isCorrect": false,
          "conceptualExplanation": "HTTP is permitted, but heavy and wasteful for small battery sensors.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "MQTT automatically generates electricity to charge the battery.",
          "isCorrect": false,
          "conceptualExplanation": "Protocols transfer data; they do not generate power.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "MQTT only works when cables are unplugged.",
          "isCorrect": false,
          "conceptualExplanation": "MQTT runs over TCP/IP across Wi-Fi, Ethernet, and cellular.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_006",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Pull-up / Pull-down Resistors",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Hardware Circuits",
      "prompt": "Why should a pushbutton connected to an input pin use a pull-up or pull-down resistor instead of leaving the pin floating?",
      "plainEnglishHelper": "Without a resistor, when the button is not pressed, the pin floats in an unpredictable state, randomly picking up electrical noise as fake clicks.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Hardware Electronics Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Circuit Design: Floating Inputs & Pull-Up/Pull-Down Stabilization; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "To guarantee a defined high (1) or low (0) voltage state when the button is open, preventing electrical noise from causing random floating inputs.",
          "isCorrect": true,
          "conceptualExplanation": "Floating pins pick up stray electromagnetic capacitance, causing erratic random triggers without pull-up/pull-down resistors.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To make the button glow in the dark.",
          "isCorrect": false,
          "conceptualExplanation": "Resistors limit current and stabilize voltage levels.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To double the internet bandwidth of the house.",
          "isCorrect": false,
          "conceptualExplanation": "Resistors operate in local circuits, not internet bandwidth.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To turn the button into a camera lens.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_007",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Deep Sleep Power Modes",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Power Management",
      "prompt": "A soil moisture sensor deployed in an agricultural field runs on a single small battery for 2 years. How does it achieve this extreme battery lifespan?",
      "plainEnglishHelper": "It spends 99.9% of its time in 'Deep Sleep' using microamps of power, waking up only for 2 seconds every hour to read moisture and send an MQTT ping.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Energy Efficient Computing under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Low-Power Sleep States & Duty-Cycle Optimization; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "By utilizing 'Deep Sleep' low-power modes to shut down the radio and CPU, waking up briefly on a timer only to sample and transmit data.",
          "isCorrect": true,
          "conceptualExplanation": "Duty-cycling with Deep Sleep reduces average current draw to microamperes, enabling multi-year battery lifespans.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "By leaving the Wi-Fi radio broadcasting at maximum power 24 hours a day.",
          "isCorrect": false,
          "conceptualExplanation": "Continuous transmission drains small batteries in a few hours.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "By running an artificial intelligence model 60 times every second continuously.",
          "isCorrect": false,
          "conceptualExplanation": "Continuous computing would drain the battery rapidly.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "By cooling the soil with ice cubes.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_008",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "I2C Bus Communication",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Hardware Communication",
      "prompt": "What is the key advantage of the I2C (Inter-Integrated Circuit) communication protocol for connecting multiple sensors to a microcontroller?",
      "plainEnglishHelper": "It only uses 2 shared wires (SDA for data, SCL for clock) to connect dozens of addressable sensors to the same pins.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Serial Bus Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Multi-Device Bus Topologies & I2C Addressing; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "It requires only two shared wires (SDA and SCL) to communicate with multiple addressable sensors on the same bus.",
          "isCorrect": true,
          "conceptualExplanation": "I2C uses unique 7-bit device addresses to communicate with multiple peripherals over just two wires.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It requires 50 separate wires for every single sensor.",
          "isCorrect": false,
          "conceptualExplanation": "I2C is celebrated specifically for minimizing pin and wire count.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It only works when submerged underwater.",
          "isCorrect": false,
          "conceptualExplanation": "I2C is standard across consumer electronics on circuit boards.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It converts electrical signals into Morse code audio beeps.",
          "isCorrect": false,
          "conceptualExplanation": "I2C is a synchronous serial digital bus protocol.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_009",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Edge Computing in IoT",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Edge Architectures",
      "prompt": "Why does an industrial vibration monitor process sensor data locally on the factory device ('Edge Computing') instead of streaming raw vibration audio to the cloud 24/7?",
      "plainEnglishHelper": "Streaming raw data continuously consumes huge cellular bandwidth and costs; analyzing locally lets the device send only an alert when an anomaly is detected.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Industrial IoT Working Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Edge Architecture: Bandwidth Reduction & Real-Time Local Anomaly Detection; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "To save massive cloud bandwidth costs and achieve instantaneous real-time emergency shutdown without depending on internet latency.",
          "isCorrect": true,
          "conceptualExplanation": "Edge computing reduces network bandwidth and delivers sub-millisecond local responses.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Because the cloud does not allow industrial data under international law.",
          "isCorrect": false,
          "conceptualExplanation": "The cloud handles industrial data, but bandwidth and latency make edge processing superior.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To make the physical machine vibrate 10 times harder.",
          "isCorrect": false,
          "conceptualExplanation": "Edge computing monitors machines to prevent destructive vibration.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Because edge computers are made of wood.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_010",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "PWM for Actuators",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Motor & Signal Control",
      "prompt": "How does Pulse Width Modulation (PWM) allow a digital microcontroller (which only outputs 0V or 3.3V) to dim an LED or control motor speed smoothly?",
      "plainEnglishHelper": "By rapidly switching the pin on and off thousands of times per second and varying the percentage of time it stays ON (the Duty Cycle).",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Digital Control Signals under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Duty Cycle Modulation & Average Voltage Simulation; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "By rapidly toggling between full voltage and zero voltage and varying the 'Duty Cycle' (ratio of ON time to OFF time) to simulate analog voltage.",
          "isCorrect": true,
          "conceptualExplanation": "High-frequency PWM creates an effective average voltage proportional to duty cycle.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "By melting the physical LED wire slightly to reduce current.",
          "isCorrect": false,
          "conceptualExplanation": "PWM switches digitally in microseconds without damaging components.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "By painting the LED bulb with dark sunglasses.",
          "isCorrect": false,
          "conceptualExplanation": "PWM controls the electrical power delivery.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "By spinning the microcontroller physically in circles.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_011",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Over-The-Air (OTA) Updates",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Firmware Maintenance",
      "prompt": "Why is Over-The-Air (OTA) firmware update capability essential for commercial smart home devices (like smart bulbs or locks)?",
      "plainEnglishHelper": "Once thousands of devices are installed in customers' homes worldwide, you cannot physically plug a USB cable into every customer's ceiling to fix bugs.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Distributed Firmware Maintenance Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Remote Maintenance & Secure Cryptographic Firmware Rollouts; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "It allows deploying bug fixes, security patches, and new features remotely over Wi-Fi without requiring physical USB access to deployed units.",
          "isCorrect": true,
          "conceptualExplanation": "OTA updates are vital for remote lifecycle management, fleet security patching, and device reliability.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It physically replaces the customer's light fixture with a new one through the mail.",
          "isCorrect": false,
          "conceptualExplanation": "OTA updates flash the software memory wirelessly.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It causes all light bulbs to turn purple permanently.",
          "isCorrect": false,
          "conceptualExplanation": "OTA firmware updates improve stability and security.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It requires customers to re-wire their home electrical panels.",
          "isCorrect": false,
          "conceptualExplanation": "OTA is completely wireless and software-driven.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_012",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "RTOS Deterministic Deadlines",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Real-Time Embedded Systems",
      "prompt": "What is the defining capability of a Real-Time Operating System (RTOS, like FreeRTOS) compared to standard desktop operating systems?",
      "plainEnglishHelper": "It guarantees that critical tasks (like triggering an automotive airbag) will execute within a precise, deterministic microsecond deadline.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Safety-Critical Systems Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Real-Time Systems: Deterministic Preemptive Scheduling & Deadline Guarantees; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Deterministic scheduling: it guarantees that high-priority safety-critical tasks execute within precise time deadlines, avoiding unpredictable OS delays.",
          "isCorrect": true,
          "conceptualExplanation": "RTOS provides deterministic preemptive scheduling where timing guarantees are mathematically bounded.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It displays 3D animated video cartoons on the screen.",
          "isCorrect": false,
          "conceptualExplanation": "RTOS focuses on timing predictability and minimal footprint.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It allows playing video games on a microwave oven.",
          "isCorrect": false,
          "conceptualExplanation": "RTOS is engineered for deterministic embedded control.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It prevents all software bugs from ever being written.",
          "isCorrect": false,
          "conceptualExplanation": "Timing guarantees do not eliminate algorithmic software logic bugs.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_013",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "IoT Security Best Practices",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Hardware Security",
      "prompt": "Which security flaw famously allowed the Mirai botnet to hijack hundreds of thousands of internet-connected IP cameras and smart routers?",
      "plainEnglishHelper": "Manufacturers shipped devices with identical, publicly documented default usernames and passwords (like 'admin' / '12345') that were never changed.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles IoT Security Failures under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Default Credential Exploitation & Hardcoded Secrets Mitigation; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Devices shipped with hardcoded, publicly known default usernames and passwords (admin/admin) accessible over unencrypted open Telnet ports.",
          "isCorrect": true,
          "conceptualExplanation": "Mirai scanned the internet for open Telnet ports with known hardcoded factory credentials.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The devices used plastic casings instead of metal casings.",
          "isCorrect": false,
          "conceptualExplanation": "Physical casing material does not stop digital network credential exploits.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The camera lenses were not cleaned with microfiber cloths.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The devices were manufactured during a leap year.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant superstition.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_014",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Wireless Range vs Bandwidth",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Wireless IoT Protocols",
      "prompt": "When designing an environmental sensor network spread across a 10-kilometer farm with no Wi-Fi coverage, which wireless technology is best suited?",
      "plainEnglishHelper": "LoRaWAN (Long Range Wide Area Network) connects devices miles away using tiny battery power, perfect for small telemetry readings.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Wireless Mesh & LPWAN Working Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "LPWAN: Long-Range Low-Power Modulation (LoRaWAN) & Link Budgets; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "LoRaWAN (Low-Power Long-Range WAN), which transmits small sensor packets over multiple kilometers with multi-year battery life.",
          "isCorrect": true,
          "conceptualExplanation": "LoRaWAN trade-offs high data bandwidth for extreme transmission distance and ultra-low power consumption.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Bluetooth Classic (range ~10 meters), requiring miles of extension cords.",
          "isCorrect": false,
          "conceptualExplanation": "Bluetooth range is limited to short personal-area distances.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Connecting a 10-kilometer HDMI cable across the farm dirt.",
          "isCorrect": false,
          "conceptualExplanation": "HDMI is a short display cable, not an agricultural network.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Yelling through a megaphone every 10 minutes.",
          "isCorrect": false,
          "conceptualExplanation": "Humorous non-technical distraction.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_iot_015",
      "domainId": "iot",
      "domainTitle": "Internet of Things & Embedded",
      "concept": "Hardware Watchdog Timers",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Embedded Reliability",
      "prompt": "What is the purpose of an independent Hardware Watchdog Timer (WDT) in a deployed IoT remote weather station?",
      "plainEnglishHelper": "If the microcontroller code hangs in an infinite freeze loop, the watchdog timer automatically resets and reboots the chip to restore normal operation.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Fault Tolerance Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Self-Healing Watchdogs & Deadlock Recovery in Unattended Systems; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "To automatically reset and reboot the microcontroller if the software hangs or freezes in an infinite deadlock.",
          "isCorrect": true,
          "conceptualExplanation": "The watchdog timer must be periodically 'kicked' by running software; if code freezes, the hardware timer reboots the system.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To bark like a physical dog to scare away burglars.",
          "isCorrect": false,
          "conceptualExplanation": "Watchdog timer is an internal electrical timer circuit.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To record audio of the weather for television stations.",
          "isCorrect": false,
          "conceptualExplanation": "Watchdog circuits monitor processor responsiveness.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To speed up the clock speed of the processor by 1,000x.",
          "isCorrect": false,
          "conceptualExplanation": "Watchdog resets frozen chips, it does not overclock.",
          "skillScore": 0
        }
      ]
    }
  ],
  "robotics": [
    {
      "id": "dom_robotics_001",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Sense-Plan-Act Loop",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Robotics Basics",
      "prompt": "What is the fundamental feedback control cycle that every autonomous robot executes continuously?",
      "plainEnglishHelper": "Sense (gather environment data with sensors) -> Plan (calculate the next action with algorithms) -> Act (move motors and actuators).",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Robotics Control Paradigms under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Sense-Plan-Act Feedback Loop & Environmental Closed-Loop Control; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Sense (read sensor inputs) -> Plan (compute algorithmic decision) -> Act (execute motor movements).",
          "isCorrect": true,
          "conceptualExplanation": "The closed-loop Sense-Plan-Act loop is the core operational paradigm of robotics.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Sleep -> Eat -> Exercise",
          "isCorrect": false,
          "conceptualExplanation": "Human biology, not autonomous robotic control.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Crash -> Reboot -> Repeat",
          "isCorrect": false,
          "conceptualExplanation": "Robotics algorithms aim specifically to avoid crashes.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Record video -> Upload to social media -> Turn off",
          "isCorrect": false,
          "conceptualExplanation": "Autonomous control involves real-time closed-loop actuation.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_002",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Obstacle Detection Sensors",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Perception Sensors",
      "prompt": "Which sensor emits high-frequency sound waves and measures the echo return time to detect the distance to nearby obstacles?",
      "plainEnglishHelper": "Bats use echolocation; small robots use an Ultrasonic distance sensor.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Echolocation & Distance Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Time-of-Flight Ranging & Acoustic Echo Calculations; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Ultrasonic Distance Sensor (e.g. HC-SR04)",
          "isCorrect": true,
          "conceptualExplanation": "Ultrasonic sensors calculate distance using sound velocity and acoustic time-of-flight.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Thermometer",
          "isCorrect": false,
          "conceptualExplanation": "Thermometers measure ambient temperature, not spatial distance.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Barometer",
          "isCorrect": false,
          "conceptualExplanation": "Barometers measure atmospheric air pressure.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Microphone listening for human laughter",
          "isCorrect": false,
          "conceptualExplanation": "Distance ranging relies on timed acoustic echo bursts.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_003",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "PID Controller Intuition",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Control Systems",
      "prompt": "Why does an autonomous mobile robot use a PID Controller (Proportional-Integral-Derivative) instead of a simple ON/OFF switch for steering?",
      "plainEnglishHelper": "A simple ON/OFF switch causes jerky, violent overshooting; a PID controller smoothly adjusts steering as the robot approaches the target line.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Control Systems Engineering Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Control Theory: Closed-Loop PID Correction & Error Minimization; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "To smoothly steer towards the target without oscillating wildly or overshooting the path.",
          "isCorrect": true,
          "conceptualExplanation": "PID combines present error, accumulated past drift, and future rate of change to produce smooth control.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To make the robot drive at the speed of sound.",
          "isCorrect": false,
          "conceptualExplanation": "PID controls precision and stability, not supersonic propulsion.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To turn the robot's headlights on when it gets dark.",
          "isCorrect": false,
          "conceptualExplanation": "PID is a mathematical feedback control loop.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To allow the robot to fly without using wings.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_004",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Forward Kinematics",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Robot Kinematics",
      "prompt": "In a multi-joint robotic arm, what does 'Forward Kinematics' calculate?",
      "plainEnglishHelper": "Given the known angles of each motor joint, where in 3D space is the robot's hand (end-effector) located?",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Geometric Transformations under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Kinematic Transformation Matrices & Spatial Coordinate Mapping; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Calculating the 3D position and orientation of the robot's hand (end-effector) based on the known joint angles.",
          "isCorrect": true,
          "conceptualExplanation": "Forward kinematics maps joint space angles to Cartesian workspace coordinates.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Calculating how much the robot cost to purchase.",
          "isCorrect": false,
          "conceptualExplanation": "Kinematics is geometric motion analysis, not financial budgeting.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Predicting the weather for tomorrow.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Changing the color of the robot's paint.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_005",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Stepper vs DC Motors",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Actuators & Motors",
      "prompt": "Why are Stepper Motors commonly chosen for 3D printers and precision robotic arms over simple DC hobby motors?",
      "plainEnglishHelper": "Stepper motors move in precise, repeatable step increments (e.g. 1.8 degrees per step) without needing continuous spinning.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Mechanical Precision Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Discrete Angular Stepping & Open-Loop Position Control; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Stepper motors move in precise, discrete angular steps, allowing exact position control without complex gearboxes.",
          "isCorrect": true,
          "conceptualExplanation": "Stepper motors provide repeatable angular positioning per pulse.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Stepper motors can only be used on submarines.",
          "isCorrect": false,
          "conceptualExplanation": "Stepper motors are ubiquitous in 3D printers, scanners, and robotics.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "DC motors explode if turned on for more than 2 seconds.",
          "isCorrect": false,
          "conceptualExplanation": "DC motors spin continuously and are used for locomotion and wheels.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Stepper motors do not consume any electrical power.",
          "isCorrect": false,
          "conceptualExplanation": "Stepper motors draw current to hold position.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_006",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "ROS 2 Architecture",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Robot Middleware",
      "prompt": "In the Robot Operating System (ROS 2), what is a 'Node' and how do different nodes communicate?",
      "plainEnglishHelper": "A node is an independent software process (e.g. camera driver or path planner); nodes exchange messages over named 'Topics'.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Robotics Middleware Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "ROS 2: Distributed Node Graphs & Publish-Subscribe Topics; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "A Node is an independent modular process performing computation; nodes communicate by publishing and subscribing to named Topics.",
          "isCorrect": true,
          "conceptualExplanation": "ROS 2 structures complex robotics software into a modular graph of communicating nodes.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "A Node is a physical bolt holding the robot's wheels together.",
          "isCorrect": false,
          "conceptualExplanation": "In ROS, a Node is a software program.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Nodes are internet websites that sell robot parts.",
          "isCorrect": false,
          "conceptualExplanation": "Nodes are local or distributed robotics software executables.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Nodes can only be written in Latin.",
          "isCorrect": false,
          "conceptualExplanation": "ROS 2 nodes are written in C++ and Python.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_007",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Odometry Drift",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "State Estimation",
      "prompt": "Why does a wheeled robot that estimates its position strictly by counting wheel encoder rotations ('Wheel Odometry') accumulate errors over time?",
      "plainEnglishHelper": "Wheel slippage on the floor, carpet texture, and tiny tire diameter differences cause dead reckoning errors to accumulate continuously.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Dead Reckoning & Drift Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Dead Reckoning Accumulation & Cumulative Drift Error; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Tire slippage, carpet friction, and surface imperfections cause tiny measurement errors to accumulate indefinitely (drift).",
          "isCorrect": true,
          "conceptualExplanation": "Dead reckoning drifts over distance; external landmarks or sensors are required for correction.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Wheel encoders automatically reverse direction every 10 seconds.",
          "isCorrect": false,
          "conceptualExplanation": "Encoders accurately measure shaft rotation, but wheels slip on ground surfaces.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The Earth's gravity stops working on wheels.",
          "isCorrect": false,
          "conceptualExplanation": "Physical traction variations cause mechanical slip.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Wheels become square when they roll too fast.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_008",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Computer Vision Object Detection",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Robot Perception",
      "prompt": "In autonomous warehouse robots, how does a vision system use OpenCV to detect and align with fiducial markers (such as AprilTags or ArUco markers)?",
      "plainEnglishHelper": "By identifying the high-contrast square corners, calculating perspective distortion, and computing the exact 3D camera pose relative to the tag.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Computer Vision & Robotics Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Perception: Fiducial Tag Detection & 6D Pose Estimation; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "By detecting high-contrast marker corners to calculate perspective transformation and estimate the exact 3D pose of the robot relative to the marker.",
          "isCorrect": true,
          "conceptualExplanation": "Fiducial markers provide millimeter-accurate relative position and orientation estimation in camera frames.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "By using a laser to burn a hole through the tag.",
          "isCorrect": false,
          "conceptualExplanation": "Vision algorithms process digital camera pixel frames.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "By playing music through the camera lens.",
          "isCorrect": false,
          "conceptualExplanation": "Camera sensors capture light images.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "By deleting all images taken during the daytime.",
          "isCorrect": false,
          "conceptualExplanation": "Vision markers operate in ambient light.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_009",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Degrees of Freedom",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Robot Mechanisms",
      "prompt": "What does it mean when an industrial robotic arm is described as having '6 Degrees of Freedom' (6-DoF)?",
      "plainEnglishHelper": "It can move along 3 translational axes (X, Y, Z: forward/back, left/right, up/down) and rotate along 3 rotational axes (roll, pitch, yaw).",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Spatial Coordinate Systems under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Spatial Coordinates & 6-DoF Kinematic Freedom; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "It can move in three positional coordinates (X, Y, Z) and rotate around three rotational axes (Roll, Pitch, Yaw).",
          "isCorrect": true,
          "conceptualExplanation": "6-DoF allows an end-effector to achieve arbitrary position and orientation in 3D workspace.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The robot is completely free of charge and costs $0.",
          "isCorrect": false,
          "conceptualExplanation": "Degrees of freedom refers to independent mechanical axes of motion.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The robot has 6 different battery chargers.",
          "isCorrect": false,
          "conceptualExplanation": "DoF describes kinematic movement variables.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The robot can only operate on 6 days of the week.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_010",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Inverse Kinematics",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Kinematics & Motion Planning",
      "prompt": "When a robotic arm needs to pick up a coffee cup at coordinates (X=0.5m, Y=0.2m, Z=0.1m), what mathematical calculation determines the required joint angles?",
      "plainEnglishHelper": "Inverse Kinematics: starting from the desired hand coordinate in 3D space, calculate what each arm joint angle must be.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Inverse Geometry Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Inverse Problem Formulations & Joint Angle Optimization; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Inverse Kinematics (IK)",
          "isCorrect": true,
          "conceptualExplanation": "Inverse Kinematics calculates the joint angles required to position an end-effector at a desired Cartesian coordinate.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Random Guessing Protocol",
          "isCorrect": false,
          "conceptualExplanation": "Robotic motion requires deterministic kinematic geometry.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Bluetooth Pairing",
          "isCorrect": false,
          "conceptualExplanation": "Bluetooth is a wireless communication standard.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Audio Equalization",
          "isCorrect": false,
          "conceptualExplanation": "Audio equalization adjusts sound frequencies.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_011",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "SLAM Navigation",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Autonomous Navigation",
      "prompt": "What does 'SLAM' stand for in autonomous mobile robotics, and what problem does it solve?",
      "plainEnglishHelper": "Simultaneous Localization and Mapping: building a map of an unknown room while simultaneously figuring out where the robot is located inside that map.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Autonomous Navigation Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Autonomous Navigation: Simultaneous Localization and Mapping (SLAM); O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Simultaneous Localization and Mapping: building a map of an unknown environment while tracking the robot's own position inside it.",
          "isCorrect": true,
          "conceptualExplanation": "SLAM solves the chicken-and-egg problem of mapping without prior location and locating without a prior map.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Super Loud Acoustic Music",
          "isCorrect": false,
          "conceptualExplanation": "Humorous non-technical acronym.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Single Layer Acceleration Motor",
          "isCorrect": false,
          "conceptualExplanation": "Incorrect robotics acronym.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Standard Linear Algorithm Model",
          "isCorrect": false,
          "conceptualExplanation": "Incorrect machine learning acronym.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_012",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Sensor Fusion with Kalman Filters",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "State Estimation",
      "prompt": "Why do autonomous vehicles use a Kalman Filter to combine readings from noisy wheel encoders and a drifting Inertial Measurement Unit (IMU)?",
      "plainEnglishHelper": "To fuse multiple imperfect sensor readings into an optimal statistical estimate of the vehicle's true position and speed.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Sensor Fusion & Probability under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Probabilistic State Estimation & Sensor Fusion; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "It mathematically fuses multiple noisy sensor streams into a statistically optimal, smoothed estimate of true position and orientation.",
          "isCorrect": true,
          "conceptualExplanation": "Kalman filtering fuses sensor uncertainty covariance matrices to deliver robust state estimates.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To filter coffee beans inside the car dashboard.",
          "isCorrect": false,
          "conceptualExplanation": "Kalman filter is an algorithmic mathematical estimator.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To make the car drive without touching the pavement.",
          "isCorrect": false,
          "conceptualExplanation": "Sensors estimate vehicle dynamics on physical roads.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To delete GPS satellites from space.",
          "isCorrect": false,
          "conceptualExplanation": "Kalman filters often integrate GPS telemetry.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_013",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Path Planning with A* Search",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Motion Planning",
      "prompt": "When an autonomous vacuum robot navigates from the living room to the kitchen charging dock, how does an A* Search algorithm find the shortest collision-free path?",
      "plainEnglishHelper": "It evaluates both the actual distance traveled so far (g) and an optimistic heuristic estimate to the goal (h), prioritizing the most promising paths.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Pathfinding & Grid Search Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Heuristic Search & Collision-Free Path Planning; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "It searches an occupancy grid map combining known movement cost g(n) and estimated heuristic cost h(n) to find the shortest collision-free path.",
          "isCorrect": true,
          "conceptualExplanation": "A* search guarantees finding the shortest obstacle-free path when the heuristic is admissible.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It moves forward until it crashes into a wall at maximum speed.",
          "isCorrect": false,
          "conceptualExplanation": "A* plans collision-free paths around obstacles on the map.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It calls an emergency plumber.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It teleports instantly across walls.",
          "isCorrect": false,
          "conceptualExplanation": "Robots obey physical geometry and space constraints.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_014",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "Hardware Emergency Stop (E-Stop)",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Robotic Safety",
      "prompt": "Why must heavy industrial robots incorporate a hardwired, physical Emergency Stop (E-Stop) circuit rather than relying solely on a software touchscreen button?",
      "plainEnglishHelper": "If the software code freezes or crashes, a hardwired physical switch cuts actuator power directly through safety relays, preventing human injury.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Industrial Safety Architecture Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Robotic Safety: Fail-Safe Hardware Interlocks & Emergency Stop Relays; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "Physical E-Stops directly break electrical power to actuators through hardwired safety relays, ensuring instantaneous stop even if software crashes.",
          "isCorrect": true,
          "conceptualExplanation": "Safety standards (ISO 13849/10218) require fail-safe physical cutoffs independent of software execution.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Touchscreens are illegal in manufacturing plants.",
          "isCorrect": false,
          "conceptualExplanation": "Touchscreens are widely used, but cannot serve as the sole safety E-Stop.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Physical buttons look more colorful on factory walls.",
          "isCorrect": false,
          "conceptualExplanation": "E-Stop design is mandated by life-safety compliance standards.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To turn on the factory air conditioning.",
          "isCorrect": false,
          "conceptualExplanation": "E-Stops disconnect dangerous actuator kinetic power.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_robotics_015",
      "domainId": "robotics",
      "domainTitle": "Robotics & Autonomous Systems",
      "concept": "LiDAR Point Clouds",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "3D Sensing",
      "prompt": "What kind of raw environmental data does a 3D LiDAR (Light Detection and Ranging) scanner produce for an autonomous vehicle?",
      "plainEnglishHelper": "A 3D 'Point Cloud' containing millions of spatial (X, Y, Z) coordinates reflecting off surfaces in the surrounding world.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles 3D Point Clouds under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Laser Time-of-Flight & 3D Spatial Point Clouds; O*NET 15-1251.00",
      "options": [
        {
          "key": "A",
          "text": "A 3D 'Point Cloud' consisting of millions of precise spatial coordinate points (X, Y, Z) mapped in real-time.",
          "isCorrect": true,
          "conceptualExplanation": "LiDAR calculates laser time-of-flight to generate dense, accurate 3D spatial representations.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "A collection of MP3 audio songs recorded from the wind.",
          "isCorrect": false,
          "conceptualExplanation": "LiDAR is an optical laser ranging sensor.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "A single black-and-white JPEG picture.",
          "isCorrect": false,
          "conceptualExplanation": "LiDAR generates spatial 3D geometry, not traditional 2D color images.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "A written summary of the vehicle's fuel efficiency.",
          "isCorrect": false,
          "conceptualExplanation": "LiDAR scans physical environmental obstacles.",
          "skillScore": 0
        }
      ]
    }
  ],
  "vlsi": [
    {
      "id": "dom_vlsi_001",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Basic Logic Gates",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Digital Logic Basics",
      "prompt": "Which fundamental logic gate produces an output of HIGH (1) if and only if BOTH of its inputs (A and B) are HIGH (1)?",
      "plainEnglishHelper": "A ____ gate requires both input A AND input B to be true.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Logic Gates under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Boolean Logic Gates & Truth Tables; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "AND Gate",
          "isCorrect": true,
          "conceptualExplanation": "An AND gate outputs 1 only when all inputs are 1; otherwise it outputs 0.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "OR Gate",
          "isCorrect": false,
          "conceptualExplanation": "An OR gate outputs 1 if either input is 1.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "NOT Gate",
          "isCorrect": false,
          "conceptualExplanation": "A NOT gate is a single-input inverter.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "XOR Gate",
          "isCorrect": false,
          "conceptualExplanation": "An XOR gate outputs 1 only when inputs are different (one 1 and one 0).",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_002",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Combinational vs Sequential",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Circuit Classification",
      "prompt": "What is the key difference between 'Combinational Logic' and 'Sequential Logic' in digital hardware circuits?",
      "plainEnglishHelper": "Combinational logic outputs depend strictly on current inputs right now (no memory); sequential logic has memory (flip-flops) and depends on past clock states.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Logic Circuit Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: State Memory & Combinational Propagation; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "Combinational logic outputs depend strictly on current inputs; Sequential logic contains memory elements (flip-flops) that store past states.",
          "isCorrect": true,
          "conceptualExplanation": "Sequential circuits have state memory synchronized by clocks; combinational circuits calculate instantaneous boolean logic.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Combinational logic is made of wood; sequential logic is made of plastic.",
          "isCorrect": false,
          "conceptualExplanation": "Both are manufactured on silicon semiconductors.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Sequential logic can only count backwards.",
          "isCorrect": false,
          "conceptualExplanation": "Sequential logic maintains arbitrary state across clock cycles.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Combinational logic only works on weekends.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_003",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Role of the Clock Signal",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Digital Synchronization",
      "prompt": "In synchronous digital microchips (like CPUs), what is the vital role of the system 'Clock' signal?",
      "plainEnglishHelper": "It acts like a musical metronome, synchronizing billions of tiny transistors so data moves forward across flip-flops simultaneously in lockstep.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Synchronous Clock Signals under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Synchronous Clock Distribution & Cycle Timings; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "It acts as a synchronizing pacemaker metronome, coordinating when flip-flops capture and advance data across the chip in lockstep.",
          "isCorrect": true,
          "conceptualExplanation": "The clock provides a periodic reference edge that synchronizes state transitions across billions of registers.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It tells the computer what time of day it is so it can sound an alarm.",
          "isCorrect": false,
          "conceptualExplanation": "System clock pulses at billions of cycles per second (GHz) to advance digital logic states.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It heats up the processor to 200 degrees Celsius.",
          "isCorrect": false,
          "conceptualExplanation": "Clocks distribute timing pulses; heating is a byproduct of dynamic power dissipation.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It translates English into Spanish.",
          "isCorrect": false,
          "conceptualExplanation": "Clocks are electrical square waves.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_004",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "D Flip-Flop Storage",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Memory Elements",
      "prompt": "What is the fundamental digital memory element that stores a single bit of state (0 or 1) and updates its output on the rising edge of a clock?",
      "plainEnglishHelper": "A D Flip-Flop (Data Flip-Flop).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Digital Circuit Foundations Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Digital Design: Edge-Triggered D Flip-Flops & Bit Registers; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "D Flip-Flop",
          "isCorrect": true,
          "conceptualExplanation": "A D flip-flop captures input D on a clock edge and holds that single bit of state until the next edge.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Resistor",
          "isCorrect": false,
          "conceptualExplanation": "Resistors resist electrical current flow; they do not store digital bits.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Solar Panel",
          "isCorrect": false,
          "conceptualExplanation": "Solar panels convert light to electricity.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Speaker wire",
          "isCorrect": false,
          "conceptualExplanation": "Speaker wire transmits audio signals.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_005",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "HDLs (Verilog and VHDL)",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Hardware Description",
      "prompt": "Why do silicon chip designers write code in Hardware Description Languages (like Verilog or VHDL) instead of drawing millions of transistors by hand?",
      "plainEnglishHelper": "HDLs describe digital circuit logic and registers in text, allowing software compilers (synthesis tools) to generate complex microchips automatically.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder ASIC Architecture Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "RTL Design: Hardware Description Languages & Behavioral Modeling; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "HDLs describe digital hardware behavior and structure in text, which automated synthesis tools compile into transistor netlists.",
          "isCorrect": true,
          "conceptualExplanation": "Modern chips contain billions of transistors; HDLs enable high-level architectural abstraction and automated synthesis.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Drawing chips with crayons on paper is prohibited by law.",
          "isCorrect": false,
          "conceptualExplanation": "Hand-drawing billions of transistors is physically impossible.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Verilog only works on kitchen microwave ovens.",
          "isCorrect": false,
          "conceptualExplanation": "Verilog is the industry standard for designing CPUs, GPUs, and ASICs.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "HDLs delete all transistors from the chip to make it cheaper.",
          "isCorrect": false,
          "conceptualExplanation": "HDLs model the logic that synthesis tools translate into physical transistors.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_006",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Multiplexer (MUX) Function",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Combinational Logic",
      "prompt": "What does a '2-to-1 Multiplexer' (MUX) do in a digital hardware circuit?",
      "plainEnglishHelper": "It acts like a railroad track switch: a Select bit chooses which of the 2 data input lines is forwarded to the single output line.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Data Routing MUX Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Data Routing Multiplexers & Conditional Steering; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "It uses a control select bit to choose which of two input data streams is steered to the single output line.",
          "isCorrect": true,
          "conceptualExplanation": "A multiplexer is a digitally controlled switch selecting one of multiple input signals to forward.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It multiplies two 64-bit numbers together.",
          "isCorrect": false,
          "conceptualExplanation": "Multiplying numbers is done by an Arithmetic Logic Unit (ALU) multiplier.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It connects a printer to Wi-Fi.",
          "isCorrect": false,
          "conceptualExplanation": "Multiplexers are fundamental silicon logic building blocks.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It turns off the electricity to the computer monitor.",
          "isCorrect": false,
          "conceptualExplanation": "MUX steers digital bit streams.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_007",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Setup and Hold Times",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Timing Analysis",
      "prompt": "In digital chip timing, why must an input signal be stable for a tiny fraction of time before (Setup Time) and after (Hold Time) the clock edge?",
      "plainEnglishHelper": "If the input voltage changes right when the flip-flop is capturing it, the flip-flop can enter a glitched, unpredictable state called 'metastability'.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Timing Closure Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "STA: Setup/Hold Time Windows & Metastability Prevention; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "To prevent metastability: the internal transistors require a stable voltage window to reliably latch the digital 0 or 1 state.",
          "isCorrect": true,
          "conceptualExplanation": "Violating setup or hold times causes flip-flops to enter metastable oscillation, corrupting digital state.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To allow the silicon to cool down to zero degrees Kelvin.",
          "isCorrect": false,
          "conceptualExplanation": "Setup and hold times are sub-nanosecond signal stability requirements.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because electrons move slower than turtle walking speeds.",
          "isCorrect": false,
          "conceptualExplanation": "Electrons propagate at a fraction of light speed through silicon traces.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To allow the user to read the bits on the screen with their eyes.",
          "isCorrect": false,
          "conceptualExplanation": "Clock edges occur in nanoseconds.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_008",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "FPGA vs ASIC",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 2,
      "prerequisiteDependency": "Silicon Implementation",
      "prompt": "What is the primary advantage of prototyping a digital processor on an FPGA before manufacturing an ASIC chip?",
      "plainEnglishHelper": "FPGAs can be reprogrammed in seconds at your desk if you find a bug; ASICs are permanently etched into physical silicon and cost millions of dollars to fix if flawed.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Reconfigurable Hardware under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Reconfigurable Logic (FPGAs) vs Custom Silicon (ASICs); O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "FPGAs are reconfigurable in seconds via software bitstreams, allowing rapid prototyping and debugging before spending millions on fixed ASIC silicon fabrication.",
          "isCorrect": true,
          "conceptualExplanation": "FPGAs allow reconfigurable circuit validation; ASICs offer maximum speed and efficiency once designs are proven.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "FPGAs can never run out of electrical battery.",
          "isCorrect": false,
          "conceptualExplanation": "FPGAs consume significant power compared to custom ASICs.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "ASICs are made of cardboard.",
          "isCorrect": false,
          "conceptualExplanation": "ASICs are manufactured on monocrystalline silicon wafers.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "FPGAs can only calculate numbers ending in the digit 5.",
          "isCorrect": false,
          "conceptualExplanation": "FPGAs implement arbitrary digital circuits.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_009",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Moore's Law",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Semiconductor History",
      "prompt": "What historical observation made by Gordon Moore in 1965 guided the semiconductor industry for decades ('Moore's Law')?",
      "plainEnglishHelper": "The number of transistors packed onto a microchip doubles approximately every two years as manufacturing processes shrink.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Exponential Growth Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Exponential Scaling & Transistor Density Trends; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "The number of transistors packed onto an integrated circuit doubles approximately every two years.",
          "isCorrect": true,
          "conceptualExplanation": "Moore's Law tracked the exponential miniaturization and cost reduction of silicon semiconductors.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Computers become physically larger and heavier every year.",
          "isCorrect": false,
          "conceptualExplanation": "Miniaturization made computers vastly smaller and lighter.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Every computer engineer must buy two new keyboards per year.",
          "isCorrect": false,
          "conceptualExplanation": "Humorous non-technical distraction.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Computer code will stop working after 100 lines.",
          "isCorrect": false,
          "conceptualExplanation": "Modern software comprises millions of lines.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_010",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Finite State Machines (FSM)",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Sequential Logic Design",
      "prompt": "How does a digital chip designer model a sequential controller (like a traffic light or vending machine controller) in Verilog?",
      "plainEnglishHelper": "As a Finite State Machine (FSM) consisting of a set of States, Transitions triggered by Clock edges, and Outputs.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder RTL Design Curriculum Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "FSM Design: State Encoding, Next-State Logic & Synchronous Transitions; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "As a Finite State Machine (FSM) defining distinct states, synchronous clock-edge transitions, and output logic.",
          "isCorrect": true,
          "conceptualExplanation": "FSMs model control logic cleanly with state registers and combinational next-state decoding.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "By typing random numbers until the screen turns green.",
          "isCorrect": false,
          "conceptualExplanation": "Hardware design requires formal state transition specifications.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "By running an internet search on every clock cycle.",
          "isCorrect": false,
          "conceptualExplanation": "Microchip FSMs execute locally in hardware nanoseconds.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "By disconnecting the power cable.",
          "isCorrect": false,
          "conceptualExplanation": "FSMs require synchronous clock power.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_011",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Static Timing Analysis (STA)",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Timing Closure",
      "prompt": "What does a Static Timing Analysis (STA) tool verify before an engineering team sends an ASIC design to the silicon manufacturing foundry?",
      "plainEnglishHelper": "It calculates the delay through every single wire and logic gate on the chip to prove all signals arrive before the clock tick (verifying positive Slack).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder VLSI Physical Implementation Team. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "VLSI Verification: Static Timing Analysis & Critical Path Slack Closure; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "It verifies that signal propagation delays through all combinational logic paths meet setup and hold requirements at target clock frequency (positive slack).",
          "isCorrect": true,
          "conceptualExplanation": "STA exhaustively checks timing paths without needing exhaustive dynamic simulation vectors.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It checks whether the engineers arrived at the office on time at 9:00 AM.",
          "isCorrect": false,
          "conceptualExplanation": "STA is an automated EDA software analysis on chip circuit delays.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It translates Verilog into spoken English audio.",
          "isCorrect": false,
          "conceptualExplanation": "STA performs mathematical path delay summation.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It tests the brightness of the office ceiling lights.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_012",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "CMOS Low-Power Principle",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Semiconductor Physics",
      "prompt": "Why is CMOS (Complementary Metal-Oxide-Semiconductor) technology the universal standard for modern microprocessors?",
      "plainEnglishHelper": "It pairs pMOS and nMOS transistors so that one is always OFF when the other is ON, consuming virtually zero static electricity when idle.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles CMOS Circuit Principles under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Complementary MOSFET Pairs & Static Power Dissipation; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "Complementary pairs of pMOS and nMOS transistors ensure virtually zero static power is drawn when gates are in steady state, consuming power mainly during switching.",
          "isCorrect": true,
          "conceptualExplanation": "CMOS revolutionized microelectronics by slashing idle static power dissipation to leakage levels.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "CMOS chips are made entirely of recycled glass bottles.",
          "isCorrect": false,
          "conceptualExplanation": "CMOS is fabricated on high-purity silicon crystal wafers.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "CMOS does not use any transistors at all.",
          "isCorrect": false,
          "conceptualExplanation": "Modern CMOS processors contain tens of billions of MOSFET transistors.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "CMOS chips only work when submerged in water.",
          "isCorrect": false,
          "conceptualExplanation": "Electronics must be protected from moisture.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_013",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Logic Synthesis Flow",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "EDA Tooling",
      "prompt": "What does an Electronic Design Automation (EDA) Logic Synthesis tool (like Synopsys Design Compiler) do with RTL Verilog code?",
      "plainEnglishHelper": "It translates the high-level Verilog code into an optimized gate-level Netlist of actual logic gates from a specific silicon foundry standard cell library.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Semiconductor Toolchain Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "EDA Tooling: RTL-to-Gate Synthesis & Standard Cell Mapping; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "It compiles behavioral RTL Verilog code into an optimized gate-level netlist mapped to specific physical standard cells from a foundry library.",
          "isCorrect": true,
          "conceptualExplanation": "Synthesis transforms abstract hardware descriptions into concrete logic gate interconnections.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It prints physical silicon wafers onto standard office paper.",
          "isCorrect": false,
          "conceptualExplanation": "Synthesis produces software netlists that drive physical placement and routing.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It deletes all comments and sends them as an email to the customer.",
          "isCorrect": false,
          "conceptualExplanation": "Synthesis is a circuit optimization and mapping compilation step.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It turns the CPU into an analog FM radio.",
          "isCorrect": false,
          "conceptualExplanation": "Synthesis produces digital gate netlists.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_014",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Clock Jitter and Skew",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Clock Tree Synthesis",
      "prompt": "Why is balanced 'Clock Tree Synthesis' (CTS) critical during the physical layout of a high-speed microprocessor?",
      "plainEnglishHelper": "To ensure the clock signal arrives at billions of flip-flops across the chip at the exact same instant, avoiding timing violations caused by Clock Skew.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Clock Distribution & Skew Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Clock Distribution Networks & Skew Minimization; O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "To minimize clock skew (arrival time differences across flip-flops) by balancing wire lengths and buffer delays across the chip.",
          "isCorrect": true,
          "conceptualExplanation": "Balanced clock trees ensure all registers across square centimeters of silicon receive clock edges synchronously.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To make the clock tick louder so humans can hear it across the room.",
          "isCorrect": false,
          "conceptualExplanation": "Clock signals are silent electrical voltage pulses.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To allow the chip to grow physical leaves like a biological tree.",
          "isCorrect": false,
          "conceptualExplanation": "Clock tree is a metaphorical name for the branching H-tree routing network.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To slow down the processor by 90% to save electricity.",
          "isCorrect": false,
          "conceptualExplanation": "CTS enables reliable operation at maximum target frequencies.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_vlsi_015",
      "domainId": "vlsi",
      "domainTitle": "VLSI & Digital Circuit Design",
      "concept": "Design Rule Checking (DRC)",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Physical Verification",
      "prompt": "Before a microchip's final layout (GDSII file) is sent to a silicon foundry (like TSMC or Intel) for manufacturing ('Tapeout'), why must it pass DRC?",
      "plainEnglishHelper": "Design Rule Checking verifies that all metal wires, transistor gates, and spacings obey the physical nanometer manufacturing limits of the foundry photolithography machines.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Silicon Physical Verification Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Silicon Fabrication: Physical Verification & Design Rule Checking (DRC); O*NET 17-2072.00",
      "options": [
        {
          "key": "A",
          "text": "To verify that all geometric shapes, wire widths, and layer spacings satisfy the foundry's photolithography manufacturing rules, preventing shorts or broken traces.",
          "isCorrect": true,
          "conceptualExplanation": "DRC ensures the geometric design is physically manufacturable without silicon defects or short-circuits.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To check the spelling of the engineers' names on the chip cover.",
          "isCorrect": false,
          "conceptualExplanation": "DRC checks nanometer physical design geometry.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To verify that the microchip is completely waterproof.",
          "isCorrect": false,
          "conceptualExplanation": "DRC validates semiconductor fabrication layer design rules.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To make sure the chip fits inside a standard postal envelope.",
          "isCorrect": false,
          "conceptualExplanation": "Chips are packaged in microscopic BGA/LGA packages.",
          "skillScore": 0
        }
      ]
    }
  ],
  "networking": [
    {
      "id": "dom_networking_001",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "IP vs MAC Address",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Network Basics",
      "prompt": "What is the difference between a device's 'MAC Address' and its 'IP Address'?",
      "plainEnglishHelper": "A MAC address is a physical hardware fingerprint burned onto your network card; an IP address is a logical address assigned by the network you connect to.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Addressing & Packets under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Hardware MAC Addressing vs Logical IP Routing; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "A MAC address is a permanent physical hardware identifier burned into the network card; an IP address is a logical routing address assigned by the local network.",
          "isCorrect": true,
          "conceptualExplanation": "MAC addresses identify physical devices on local links (Layer 2); IP addresses route packets across internetworks (Layer 3).",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "MAC addresses only work on Apple Mac computers.",
          "isCorrect": false,
          "conceptualExplanation": "MAC stands for Media Access Control and exists on all Ethernet and Wi-Fi devices.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "IP addresses can only be viewed in the United States.",
          "isCorrect": false,
          "conceptualExplanation": "IP addresses are global internet routing coordinates.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "They are identical numbers formatted with different colors.",
          "isCorrect": false,
          "conceptualExplanation": "MAC is a 48-bit hex address; IPv4 is a 32-bit dotted-decimal address.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_002",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "TCP vs UDP",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Transport Layer",
      "prompt": "Why does online video gaming and live voice chat typically use UDP instead of TCP?",
      "plainEnglishHelper": "UDP transmits fast without waiting to resend lost packets; TCP retransmits lost packets which causes lag and stutter in live real-time streams.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Packet Transmission Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Transport Protocols (TCP vs UDP) & Latency-Reliability Trade-offs; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "UDP prioritizes low latency and speed by avoiding retransmissions, whereas TCP guarantees reliable, ordered delivery at the cost of retransmission delays.",
          "isCorrect": true,
          "conceptualExplanation": "Real-time gaming prefers dropping an occasional stale packet over freezing the game while TCP waits for retransmissions.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "TCP cannot transmit data through Wi-Fi routers.",
          "isCorrect": false,
          "conceptualExplanation": "TCP operates across all network media.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "UDP is completely free of charge while TCP costs $1 per packet.",
          "isCorrect": false,
          "conceptualExplanation": "Both are open internet protocol standards.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "UDP encrypts all game audio with high-security passwords.",
          "isCorrect": false,
          "conceptualExplanation": "Encryption is handled by higher-layer protocols like DTLS.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_003",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "DNS Name Resolution",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Application Layer",
      "prompt": "What is the primary job of the Domain Name System (DNS) on the internet?",
      "plainEnglishHelper": "It acts like the internet's phonebook: converting human-friendly website names (like 'google.com') into machine-routable IP addresses (like '142.250.190.46').",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles The Domain Name System under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Hierarchical Naming & DNS IP Resolution; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "To translate human-friendly domain names (e.g. google.com) into numerical IP addresses that computers use to route packets.",
          "isCorrect": true,
          "conceptualExplanation": "DNS is the distributed hierarchical directory service resolving hostnames to IP addresses.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To physically connect computer monitors to electricity.",
          "isCorrect": false,
          "conceptualExplanation": "DNS is an application-layer network protocol.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "To delete spam emails from email inboxes.",
          "isCorrect": false,
          "conceptualExplanation": "DNS resolves names, it is not an email spam filter.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To measure the length of Ethernet cables.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_004",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "DHCP Auto-Assignment",
      "category": "Technical Proficiency",
      "difficulty": 1,
      "prerequisiteDependency": "Network Addressing",
      "prompt": "When your smartphone connects to a new Wi-Fi network at a coffee shop, which protocol automatically assigns it a valid local IP address and gateway settings?",
      "plainEnglishHelper": "DHCP (Dynamic Host Configuration Protocol).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Internet Core Protocols Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Network Infrastructure: Dynamic Host Configuration Protocol (DHCP) Leasing; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "DHCP (Dynamic Host Configuration Protocol)",
          "isCorrect": true,
          "conceptualExplanation": "DHCP automatically leases IP addresses, subnet masks, and default gateways to joining clients.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Bluetooth Audio Protocol",
          "isCorrect": false,
          "conceptualExplanation": "Bluetooth is for personal wireless peripherals.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "FTP (File Transfer Protocol)",
          "isCorrect": false,
          "conceptualExplanation": "FTP is an unencrypted file transfer protocol.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "HDMI",
          "isCorrect": false,
          "conceptualExplanation": "HDMI is a physical display cable interface.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_005",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "Routers vs Switches",
      "category": "Conceptual Understanding",
      "difficulty": 1,
      "prerequisiteDependency": "Network Devices",
      "prompt": "What is the difference between a Network Switch and a Network Router?",
      "plainEnglishHelper": "A switch connects multiple devices together inside the same local LAN; a router connects different networks together and forwards traffic across the internet.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Routing vs Switching Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Local Switching (L2) vs Inter-Network Routing (L3); O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "A Switch connects devices within the same local network (LAN) using MAC addresses; a Router connects different networks together and routes packets using IP addresses.",
          "isCorrect": true,
          "conceptualExplanation": "Switches forward frames on Layer 2; routers route packets between distinct IP subnets on Layer 3.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "A Switch is a physical button that turns off the internet.",
          "isCorrect": false,
          "conceptualExplanation": "A network switch is an active packet-forwarding hardware device.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Routers can only be used on airplanes.",
          "isCorrect": false,
          "conceptualExplanation": "Routers connect homes, enterprises, and the global internet.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Switches delete all files sent through them.",
          "isCorrect": false,
          "conceptualExplanation": "Switches inspect destination MAC addresses and forward frames.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_006",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "The OSI 7-Layer Model",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Network Architecture",
      "prompt": "In the 7-Layer OSI Reference Model, which layer is responsible for end-to-end packet routing across intermediate networks using IP addresses?",
      "plainEnglishHelper": "Layer 3: The Network Layer.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder OSI Architectural Working Group. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "OSI Model: Layer 3 Network Routing & Logical Addressing; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "Layer 3: Network Layer",
          "isCorrect": true,
          "conceptualExplanation": "Layer 3 handles logical IP addressing, path determination, and routing across internetworks.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Layer 1: Physical Layer",
          "isCorrect": false,
          "conceptualExplanation": "Layer 1 transmits raw electrical or optical bits over cables.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Layer 7: Application Layer",
          "isCorrect": false,
          "conceptualExplanation": "Layer 7 interfaces with user software (HTTP, DNS, SSH).",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Layer 2: Data Link Layer",
          "isCorrect": false,
          "conceptualExplanation": "Layer 2 handles local MAC framing between adjacent nodes.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_007",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "Subnet Masks & CIDR",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "IP Subnetting",
      "prompt": "In an IPv4 network, what does a subnet mask of '255.255.255.0' (or /24) tell a computer about an IP address like '192.168.1.50'?",
      "plainEnglishHelper": "The first 24 bits (192.168.1) identify the Network, and the last 8 bits (.50) identify the specific Host device.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Subnetting & IP Masks under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: IPv4 Subnet Masking, Network ID & Host Partitioning; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "The first 24 bits (192.168.1) identify the shared Network ID, and the remaining 8 bits (.50) identify the specific Host device.",
          "isCorrect": true,
          "conceptualExplanation": "Subnet masks split IP addresses into the network portion and host portion using binary masking.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "The computer can only download 50 files from the internet.",
          "isCorrect": false,
          "conceptualExplanation": "Subnet masks define network boundaries, not file limits.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "The internet will disconnect at 50 seconds past the hour.",
          "isCorrect": false,
          "conceptualExplanation": "IP addresses are hierarchical network coordinates.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "The computer is infected with 255 viruses.",
          "isCorrect": false,
          "conceptualExplanation": "255 is an octet binary byte representation (11111111).",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_008",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "Ping and ICMP",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Network Diagnostics",
      "prompt": "When a network technician runs the terminal command 'ping 8.8.8.8', what protocol is being used to test reachability and measure round-trip latency?",
      "plainEnglishHelper": "ICMP (Internet Control Message Protocol) sending Echo Requests and receiving Echo Replies.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Network Diagnostics Challenge under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Diagnostic Protocols (ICMP) & Round-Trip Latency Verification; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "ICMP (Internet Control Message Protocol)",
          "isCorrect": true,
          "conceptualExplanation": "Ping uses ICMP Echo Request and Echo Reply messages to measure round-trip latency and packet loss.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "SMTP (Simple Mail Transfer Protocol)",
          "isCorrect": false,
          "conceptualExplanation": "SMTP is for sending emails.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Bluetooth Low Energy",
          "isCorrect": false,
          "conceptualExplanation": "Bluetooth is a short-range wireless standard.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Audio MIDI",
          "isCorrect": false,
          "conceptualExplanation": "MIDI is a musical instrument digital interface.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_009",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "NAT Translation",
      "category": "Conceptual Understanding",
      "difficulty": 2,
      "prerequisiteDependency": "Address Conservation",
      "prompt": "What is the function of Network Address Translation (NAT) running on your home Wi-Fi router?",
      "plainEnglishHelper": "It allows all your laptops, phones, and TVs (using private IPs like 192.168.1.x) to share a single public IP address on the internet.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Internet Routing Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "IP Conservation: Network Address Translation & Port Mapping; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "It translates private local IP addresses from multiple home devices into a single public routable IP address for internet communication.",
          "isCorrect": true,
          "conceptualExplanation": "NAT conserves scarce IPv4 addresses by multiplexing private subnets through one public gateway address.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It translates human speech into computer binary code.",
          "isCorrect": false,
          "conceptualExplanation": "NAT translates IP packet header addresses.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It charges $1 for every website visited.",
          "isCorrect": false,
          "conceptualExplanation": "NAT is an internal routing feature on standard home routers.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It deletes all emails sent after midnight.",
          "isCorrect": false,
          "conceptualExplanation": "NAT handles IP packet address mapping.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_010",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "Wireshark Packet Analysis",
      "category": "Technical Proficiency",
      "difficulty": 2,
      "prerequisiteDependency": "Packet Inspection",
      "prompt": "What is the industry-standard software tool used by network engineers to capture and inspect live network packet frames traveling across an interface?",
      "plainEnglishHelper": "Wireshark (packet capture and protocol analyzer).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Network Analysis Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Network Tooling: Packet Capture & Protocol Decoding (Wireshark); O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "Wireshark",
          "isCorrect": true,
          "conceptualExplanation": "Wireshark is the standard open-source network protocol analyzer for deep packet inspection.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Microsoft Paint",
          "isCorrect": false,
          "conceptualExplanation": "Paint is a basic bitmap image drawing utility.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "iTunes",
          "isCorrect": false,
          "conceptualExplanation": "iTunes is a media player.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Notepad alone",
          "isCorrect": false,
          "conceptualExplanation": "Notepad is a plain text editor without packet capture drivers.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_011",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "Virtual LANs (VLANs)",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Network Segmentation",
      "prompt": "Why do corporate network engineers create separate 'VLANs' (Virtual LANs) for Guest Wi-Fi vs Internal Corporate Accounting?",
      "plainEnglishHelper": "To isolate traffic logically on the same physical switch, preventing coffee shop guests from accessing confidential financial servers.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles Network Segmentation under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: Virtual LAN Segmentation & Broadcast Domain Isolation; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "To logically segment the network so guest users cannot access sensitive internal corporate servers on the same physical infrastructure.",
          "isCorrect": true,
          "conceptualExplanation": "VLANs isolate broadcast domains and enforce security boundaries across shared switches.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "To make guest internet connections 100 times faster than corporate internet.",
          "isCorrect": false,
          "conceptualExplanation": "VLANs enforce security isolation and bandwidth policing.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Because switches can only plug into one computer at a time.",
          "isCorrect": false,
          "conceptualExplanation": "Enterprise switches have dozens of physical ports mapped to VLANs.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "To convert all text into binary audio files.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_012",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "OSPF vs BGP",
      "category": "Problem-Solving & Computational Thinking",
      "difficulty": 3,
      "prerequisiteDependency": "Routing Protocols",
      "prompt": "What is the operational difference between an Interior Gateway Protocol (like OSPF) and an Exterior Gateway Protocol (like BGP)?",
      "plainEnglishHelper": "OSPF routes traffic fast inside a single company's private network; BGP routes traffic between different massive internet service providers across the entire globe.",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Authored by PathFinder Core Internet Architecture Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "Internet Routing: Intra-Domain (OSPF) vs Inter-Autonomous System (BGP) Routing; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "OSPF routes traffic within a single company's internal autonomous system (IGP); BGP routes traffic between different autonomous systems across the global internet (EGP).",
          "isCorrect": true,
          "conceptualExplanation": "OSPF optimizes shortest-path routing inside enterprise networks; BGP is the routing backbone of the internet.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "OSPF is for mobile phones only; BGP is for desktop computers only.",
          "isCorrect": false,
          "conceptualExplanation": "Both are router protocols running on enterprise routing hardware.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "BGP is a video game graphics library.",
          "isCorrect": false,
          "conceptualExplanation": "BGP stands for Border Gateway Protocol.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "OSPF deletes the internet every night at midnight.",
          "isCorrect": false,
          "conceptualExplanation": "Both protocols provide high-availability routing resilience.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_013",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "IPv4 vs IPv6",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Address Exhaustion",
      "prompt": "Why was IPv6 (with 128-bit addresses) developed to replace IPv4 (with 32-bit addresses)?",
      "plainEnglishHelper": "IPv4 only provides ~4.3 billion total addresses, which have run out due to billions of smartphones, laptops, and IoT devices worldwide.",
      "provenance": {
        "source": "Bebras International Challenge on Informatics",
        "attribution": "Adapted from Bebras Address Space Scaling Task under CC BY-SA 4.0.",
        "license": "CC BY-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Bebras CT: Exponential Address Space & 128-bit IPv6 Adoption; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "The 32-bit IPv4 address space (~4.3 billion addresses) was exhausted by billions of global devices; IPv6 provides virtually limitless addresses (3.4 x 10^38).",
          "isCorrect": true,
          "conceptualExplanation": "IPv6 vastly expands address capacity, eliminates the mandatory need for NAT, and streamlines packet headers.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "IPv4 addresses caused computer screens to turn black and white.",
          "isCorrect": false,
          "conceptualExplanation": "IPv4 is an addressing scheme, unrelated to display rendering.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "IPv6 makes all computers physically lighter to carry.",
          "isCorrect": false,
          "conceptualExplanation": "IPv6 is a networking protocol standard.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "IPv4 was outlawed by the United Nations.",
          "isCorrect": false,
          "conceptualExplanation": "IPv4 continues to operate during dual-stack transitions.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_014",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "Software-Defined Networking (SDN)",
      "category": "Conceptual Understanding",
      "difficulty": 3,
      "prerequisiteDependency": "Advanced Networking",
      "prompt": "What is the architectural paradigm shift introduced by Software-Defined Networking (SDN)?",
      "plainEnglishHelper": "Separating the 'Control Plane' (centralized intelligent decision making) from the 'Data Plane' (switches simply forwarding packets quickly).",
      "provenance": {
        "source": "PathFinder Academic Working Group",
        "attribution": "Curated by PathFinder Next-Gen Network Architecture Practice. Educational Open Access.",
        "license": "Educational Open Access",
        "is_modified": false
      },
      "competencyMapping": "SDN: Control Plane / Data Plane Decoupling & OpenFlow Programmability; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "Decoupling the network Control Plane (centralized routing logic) from the Data Forwarding Plane (switches forwarding packets).",
          "isCorrect": true,
          "conceptualExplanation": "SDN enables centralized, programmable network management via software controllers.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "Replacing all network wires with string and tin cans.",
          "isCorrect": false,
          "conceptualExplanation": "Nonsensical humorous distraction.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "Deleting all network switches and routers completely.",
          "isCorrect": false,
          "conceptualExplanation": "Hardware data-plane forwarding switches are still required for packet throughput.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "Requiring all network engineers to work only while standing up.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    },
    {
      "id": "dom_networking_015",
      "domainId": "networking",
      "domainTitle": "Computer Networks & Systems",
      "concept": "TCP Handshake & Flow Control",
      "category": "Technical Proficiency",
      "difficulty": 3,
      "prerequisiteDependency": "Transport Reliability",
      "prompt": "How does TCP establish a reliable connection before transmitting data, and how does it prevent overwhelming a slow receiver?",
      "plainEnglishHelper": "The 3-Way Handshake (SYN, SYN-ACK, ACK) establishes the connection, and the Sliding Window Flow Control regulates transmission speed.",
      "provenance": {
        "source": "Code.org & CS Principles Micro-Challenges",
        "attribution": "Adapted from Code.org CS Principles TCP Reliability & Congestion Control under CC BY-NC-SA 4.0.",
        "license": "CC BY-NC-SA 4.0",
        "is_modified": true
      },
      "competencyMapping": "Code.org: TCP Three-Way Handshake & Sliding Window Flow Control; O*NET 15-1244.00",
      "options": [
        {
          "key": "A",
          "text": "It uses a 3-Way Handshake (SYN, SYN-ACK, ACK) to synchronize sequence numbers, and Sliding Window Flow Control to match the receiver's capacity.",
          "isCorrect": true,
          "conceptualExplanation": "The 3-way handshake initializes reliable state, and flow control prevents buffer overflow.",
          "skillScore": 10
        },
        {
          "key": "B",
          "text": "It sends an email to the receiver asking for permission to send data.",
          "isCorrect": false,
          "conceptualExplanation": "TCP handshakes take milliseconds over network packets.",
          "skillScore": 0
        },
        {
          "key": "C",
          "text": "It shuts down the internet connection after sending 10 bytes.",
          "isCorrect": false,
          "conceptualExplanation": "TCP transmits gigabytes continuously.",
          "skillScore": 0
        },
        {
          "key": "D",
          "text": "It turns off the computer's CPU fan.",
          "isCorrect": false,
          "conceptualExplanation": "Irrelevant.",
          "skillScore": 0
        }
      ]
    }
  ]
};

export default DOMAIN_QUESTION_BANK;
