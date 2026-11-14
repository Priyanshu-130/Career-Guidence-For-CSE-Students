/**
 * roadmap.sh Inspired Interactive Visual Flow Data
 * Complete structured learning tracks for all 9 canonical CSE domains
 */

export const ROADMAP_SH_DOMAINS = {
  "ai": {
    "title": "AI & Machine Learning Engineer",
    "description": "Step by step guide to becoming an Artificial Intelligence and Machine Learning Engineer in 2026",
    "nodes": [
      {
        "id": "ai-python",
        "stage": 1,
        "stageTitle": "Phase 1: Programming & Math Foundations",
        "title": "Python for AI & Computing",
        "type": "recommended",
        "description": "Python is the undisputed lingua franca of Artificial Intelligence, providing rich numerical syntax, dynamic typing, and the most mature ML package ecosystem.",
        "whyLearn": "Every modern AI framework (PyTorch, TensorFlow, Scikit-Learn, Hugging Face) is built with primary Python bindings.",
        "subtopics": [
          "Virtual environments (venv, uv, conda)",
          "Data structures: dict, set, list comprehensions",
          "Object-Oriented Programming (classes, inheritance)",
          "Functional programming: lambda, map, filter",
          "Exception handling & file I/O"
        ],
        "resources": [
          {
            "title": "Official Python Tutorial",
            "url": "https://docs.python.org/3/tutorial/",
            "type": "Documentation"
          },
          {
            "title": "Harvard CS50P: CS50's Introduction to Programming with Python",
            "url": "https://cs50.harvard.edu/python/",
            "type": "Free Course"
          },
          {
            "title": "Automate the Boring Stuff with Python",
            "url": "https://automatetheboringstuff.com/",
            "type": "Book"
          }
        ],
        "challenge": "Build a command-line data processing script that reads a messy CSV file, validates schema types, handles missing values, and writes a clean JSON report."
      },
      {
        "id": "ai-math",
        "stage": 1,
        "stageTitle": "Phase 1: Programming & Math Foundations",
        "title": "Linear Algebra & Vector Spaces",
        "type": "recommended",
        "description": "Neural networks, embeddings, and transformations are fundamentally linear algebra operations performed over multi-dimensional vector spaces.",
        "whyLearn": "Understanding matrix multiplication, dot products, eigenvalues, and rank is essential to debug tensor operations and understand model architectures.",
        "subtopics": [
          "Vectors: dot products, projections, norms (L1/L2)",
          "Matrices: transpose, inverse, determinant, rank",
          "Matrix multiplication dimensions & broadcasting",
          "Eigenvalues & Eigenvectors",
          "Singular Value Decomposition (SVD)"
        ],
        "resources": [
          {
            "title": "3Blue1Brown: Essence of Linear Algebra",
            "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
            "type": "Video Series"
          },
          {
            "title": "MIT 18.06: Linear Algebra by Gilbert Strang",
            "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
            "type": "OpenCourseWare"
          }
        ],
        "challenge": "Implement matrix multiplication from scratch using pure nested loops, then verify your results against NumPy's np.matmul() across 1,000 randomized matrices."
      },
      {
        "id": "ai-git",
        "stage": 1,
        "stageTitle": "Phase 1: Programming & Math Foundations",
        "title": "Git & GitHub Version Control",
        "type": "recommended",
        "description": "Git is the global standard for tracking code changes, branching experimental models, and collaborating on machine learning codebases.",
        "whyLearn": "Industry engineering teams require disciplined pull requests, semantic commit messages, and collaborative git branching.",
        "subtopics": [
          "git init, clone, add, commit, push, pull",
          "Feature branching and merging strategies",
          "Resolving merge conflicts safely",
          "Writing descriptive commit messages (.gitignore for datasets)",
          "GitHub Pull Requests, code reviews & releases"
        ],
        "resources": [
          {
            "title": "Pro Git Book (Official Free Edition)",
            "url": "https://git-scm.com/book/en/v2",
            "type": "Documentation"
          },
          {
            "title": "GitHub Skills: Introduction to GitHub",
            "url": "https://skills.github.com/",
            "type": "Interactive"
          }
        ],
        "challenge": "Initialize a GitHub repository for your AI projects, create an experimental branch, make 3 distinct commits, and open a Pull Request into main with a summary."
      },
      {
        "id": "ai-numpy-pandas",
        "stage": 2,
        "stageTitle": "Phase 2: Data Wrangling & Exploratory Analysis",
        "title": "NumPy & Pandas Data Wrangling",
        "type": "recommended",
        "description": "NumPy handles fast vectorized tensor arrays in C memory, while Pandas provides high-level DataFrames for tabular data cleaning, grouping, and feature filtering.",
        "whyLearn": "80% of real-world machine learning time is spent cleaning raw datasets and transforming messy data into clean model features.",
        "subtopics": [
          "NumPy ndarray slicing, indexing & broadcasting",
          "Pandas DataFrames, Series, and Indexing (.loc, .iloc)",
          "Handling missing values (dropna, fillna, interpolate)",
          "GroupBy aggregations & merge / join operations",
          "Exporting clean datasets to Parquet and CSV"
        ],
        "resources": [
          {
            "title": "Official NumPy Quickstart Tutorial",
            "url": "https://numpy.org/doc/stable/user/quickstart.html",
            "type": "Documentation"
          },
          {
            "title": "10 Minutes to pandas",
            "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
            "type": "Guide"
          }
        ],
        "challenge": "Download a 100,000-row real estate or sales CSV, clean missing values, compute average sales by region using groupby, and save the result as an optimized Parquet file."
      },
      {
        "id": "ai-eda-viz",
        "stage": 2,
        "stageTitle": "Phase 2: Data Wrangling & Exploratory Analysis",
        "title": "Data Visualization (Matplotlib & Seaborn)",
        "type": "alternative",
        "description": "Visualizing distributions, correlations, and outliers reveals hidden patterns before feeding numbers into algorithms.",
        "whyLearn": "Visualization prevents deceptive modeling assumptions and lets you communicate insights to stakeholders.",
        "subtopics": [
          "Histograms & Box Plots for distribution checks",
          "Scatter plots & Pair plots for bivariate relationships",
          "Correlation heatmaps using Pearson/Spearman coefficients",
          "Bar charts & Line plots for category/time trends",
          "Plotly for interactive web charts (optional)"
        ],
        "resources": [
          {
            "title": "Seaborn Official Gallery & Tutorial",
            "url": "https://seaborn.pydata.org/tutorial.html",
            "type": "Documentation"
          },
          {
            "title": "Python Data Science Handbook (Free Online)",
            "url": "https://jakevdp.github.io/PythonDataScienceHandbook/",
            "type": "Book"
          }
        ],
        "challenge": "Generate a multi-panel exploratory report containing a correlation heatmap, box plots highlighting outliers, and distribution histograms for a real dataset."
      },
      {
        "id": "ai-scikit-learn",
        "stage": 3,
        "stageTitle": "Phase 3: Classical Machine Learning",
        "title": "Scikit-Learn & Classical ML",
        "type": "recommended",
        "description": "Master the foundational supervised and unsupervised algorithms: Linear/Logistic Regression, Decision Trees, Random Forests, SVMs, and K-Means.",
        "whyLearn": "Most real-world business problems on tabular data are solved effectively with Random Forests and Gradient Boosted Trees without needing deep learning.",
        "subtopics": [
          "Train/Test split & K-Fold Cross Validation",
          "Linear Regression & Logistic Regression",
          "Decision Trees & Random Forest Ensembles",
          "XGBoost / LightGBM Gradient Boosted Trees",
          "Scikit-Learn Pipelines (StandardScaler + Model)"
        ],
        "resources": [
          {
            "title": "Scikit-Learn User Guide & Getting Started",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "type": "Documentation"
          },
          {
            "title": "StatQuest with Josh Starmer: Machine Learning",
            "url": "https://statquest.org/",
            "type": "Video Series"
          }
        ],
        "challenge": "Train an XGBoost / Random Forest classifier on the Titanic or Housing dataset, tune hyperparameters with GridSearchCV, and achieve >82% cross-validated accuracy."
      },
      {
        "id": "ai-metrics",
        "stage": 3,
        "stageTitle": "Phase 3: Classical Machine Learning",
        "title": "Model Evaluation & Diagnostics",
        "type": "recommended",
        "description": "Learn to diagnose overfitting, underfitting, data leakage, and select the correct evaluation metrics for balanced and imbalanced datasets.",
        "whyLearn": "Choosing raw accuracy on an imbalanced dataset causes silent production failure; understanding Precision, Recall, and AUC-ROC is vital.",
        "subtopics": [
          "Confusion Matrix: TP, FP, TN, FN",
          "Precision, Recall, and F1-Score trade-offs",
          "ROC Curve & Area Under the Curve (AUC-ROC)",
          "Regression metrics: RMSE, MAE, R\u00b2 score",
          "Detecting Data Leakage during feature engineering"
        ],
        "resources": [
          {
            "title": "Google ML Crash Course: Classification Metrics",
            "url": "https://developers.google.com/machine-learning/crash-course/classification/true-false-positive-negative",
            "type": "Course"
          },
          {
            "title": "Scikit-Learn Metrics Guide",
            "url": "https://scikit-learn.org/stable/modules/model_evaluation.html",
            "type": "Documentation"
          }
        ],
        "challenge": "Construct a confusion matrix and precision-recall curve for an imbalanced fraud detection dataset, demonstrating why F1-score is superior to raw accuracy."
      },
      {
        "id": "ai-deep-learning",
        "stage": 4,
        "stageTitle": "Phase 4: Deep Learning & Neural Networks",
        "title": "PyTorch & Neural Network Fundamentals",
        "type": "recommended",
        "description": "PyTorch is the leading deep learning framework across industry and research, utilizing dynamic computation graphs and clean Pythonic autograd tensors.",
        "whyLearn": "State-of-the-art vision, speech, and generative language models are overwhelmingly researched and implemented in PyTorch.",
        "subtopics": [
          "Tensors, GPU acceleration (.to('cuda')), and Autograd",
          "Building custom models with nn.Module",
          "Loss functions (CrossEntropyLoss, MSELoss)",
          "Optimizers: SGD with Momentum, AdamW",
          "PyTorch Dataset & DataLoader for batching"
        ],
        "resources": [
          {
            "title": "Deep Learning with PyTorch: A 60 Minute Blitz",
            "url": "https://pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html",
            "type": "Tutorial"
          },
          {
            "title": "fast.ai: Practical Deep Learning for Coders",
            "url": "https://course.fast.ai/",
            "type": "Free Course"
          }
        ],
        "challenge": "Build and train a 3-layer neural network in PyTorch from scratch to classify handwritten digits from MNIST, writing your own training loop with backprop."
      },
      {
        "id": "ai-tensorflow",
        "stage": 4,
        "stageTitle": "Phase 4: Deep Learning & Neural Networks",
        "title": "TensorFlow & Keras (Alternative)",
        "type": "alternative",
        "description": "Google's production framework emphasizing high-level Keras APIs, mobile deployment (TFLite), and browser inference (TensorFlow.js).",
        "whyLearn": "Many established enterprises still run production pipelines on TensorFlow and TensorFlow Serving.",
        "subtopics": [
          "Keras Sequential & Functional API",
          "tf.data pipelines for memory-efficient loading",
          "TensorBoard for loss and metric visualization",
          "Model saving and export to SavedModel format",
          "TensorFlow Lite for mobile devices"
        ],
        "resources": [
          {
            "title": "TensorFlow Core Tutorials",
            "url": "https://www.tensorflow.org/tutorials",
            "type": "Documentation"
          }
        ],
        "challenge": "Implement the same digit classifier using Keras Sequential API and visualize loss convergence live in TensorBoard."
      },
      {
        "id": "ai-nlp-transformers",
        "stage": 5,
        "stageTitle": "Phase 5: Modern LLMs & Natural Language Processing",
        "title": "Transformers & Hugging Face",
        "type": "recommended",
        "description": "Modern Natural Language Processing is powered by Self-Attention and the Transformer architecture (BERT, GPT, Llama, T5).",
        "whyLearn": "Hugging Face is the universal repository for open-weight models, tokenizers, and datasets, powering modern AI engineering.",
        "subtopics": [
          "Tokenization: Byte-Pair Encoding (BPE) & WordPiece",
          "Self-Attention mechanism & Positional Encoding",
          "Encoder models (BERT) vs Decoder models (GPT/Llama)",
          "Hugging Face transformers pipeline API",
          "Fine-tuning a pre-trained model with PEFT / LoRA"
        ],
        "resources": [
          {
            "title": "Hugging Face NLP Course (Free & Interactive)",
            "url": "https://huggingface.co/learn/nlp-course/",
            "type": "Interactive Course"
          },
          {
            "title": "Jay Alammar: The Illustrated Transformer",
            "url": "http://jalammar.github.io/illustrated-transformer/",
            "type": "Visual Guide"
          }
        ],
        "challenge": "Use Hugging Face transformers to fine-tune a small sentiment analysis model on movie reviews using LoRA, evaluating accuracy on an unseen test set."
      },
      {
        "id": "ai-rag-vector-db",
        "stage": 5,
        "stageTitle": "Phase 5: Modern LLMs & Natural Language Processing",
        "title": "RAG & Vector Databases",
        "type": "recommended",
        "description": "Retrieval-Augmented Generation (RAG) connects Large Language Models to private company knowledge bases using vector similarity search.",
        "whyLearn": "RAG is the #1 enterprise AI pattern used in companies today to prevent hallucinations and query private PDFs/documents.",
        "subtopics": [
          "Text embeddings (OpenAI, HuggingFace, sentence-transformers)",
          "Vector similarity metrics: Cosine Similarity, Dot Product",
          "Vector Databases: ChromaDB, Pinecone, FAISS, Weaviate",
          "Document chunking strategies and metadata filtering",
          "LangChain / LlamaIndex orchestration frameworks"
        ],
        "resources": [
          {
            "title": "Pinecone Learning Center: What is Vector Search?",
            "url": "https://www.pinecone.io/learn/vector-database/",
            "type": "Guide"
          },
          {
            "title": "LangChain Official Documentation",
            "url": "https://python.langchain.com/",
            "type": "Documentation"
          }
        ],
        "challenge": "Build a functional 'Chat with your PDF' app using ChromaDB and a local HuggingFace embedding model that answers questions from an uploaded document with citations."
      },
      {
        "id": "ai-mlops",
        "stage": 6,
        "stageTitle": "Phase 6: Deployment, MLOps & Production",
        "title": "Model Serving & FastAPI",
        "type": "recommended",
        "description": "Packaging models into high-performance web APIs using FastAPI, Docker containers, and cloud endpoints for live application inference.",
        "whyLearn": "A model stored in a Jupyter notebook provides zero business value until it is packaged behind a resilient production REST endpoint.",
        "subtopics": [
          "FastAPI async routes, Pydantic data schemas",
          "Model loading on startup (@asynccontextmanager)",
          "Dockerizing the ML API with Dockerfile",
          "Model versioning and registries (MLflow)",
          "Deploying to Cloud runtimes (Render, AWS ECS, GCP)"
        ],
        "resources": [
          {
            "title": "FastAPI Official Tutorial",
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "type": "Documentation"
          },
          {
            "title": "Made With ML: Production MLOps Course",
            "url": "https://madewithml.com/",
            "type": "Free Course"
          }
        ],
        "challenge": "Dockerize a FastAPI application that serves your Scikit-Learn or PyTorch model, accepts JSON inference payloads, and returns predictions with response latency < 50ms."
      }
    ]
  },
  "data": {
    "title": "Data Scientist & Analytics Engineer",
    "description": "Step by step guide to becoming a Data Scientist and Analytics Engineer in 2026",
    "nodes": [
      {
        "id": "data-python",
        "stage": 1,
        "stageTitle": "Phase 1: Programming & Math Basics",
        "title": "Python for Data Analysis",
        "type": "recommended",
        "description": "Python combined with Jupyter Notebooks forms the primary interactive computing environment for data exploration and modeling.",
        "whyLearn": "Standard language across scientific computing, statistics, and machine learning pipelines.",
        "subtopics": [
          "Python data structures & list/dict comprehensions",
          "Jupyter Notebook & Google Colab shortcuts",
          "Virtual environments (venv/uv)",
          "Writing reusable functions and modules"
        ],
        "resources": [
          {
            "title": "Python for Data Analysis by Wes McKinney",
            "url": "https://wesmckinney.com/book/",
            "type": "Book"
          },
          {
            "title": "Kaggle Python Micro-Course",
            "url": "https://www.kaggle.com/learn/python",
            "type": "Interactive"
          }
        ],
        "challenge": "Load a dirty CSV dataset in Jupyter, inspect data types, handle missing values, and print clean summary statistics."
      },
      {
        "id": "data-sql",
        "stage": 1,
        "stageTitle": "Phase 1: Programming & Math Basics",
        "title": "SQL Mastery (PostgreSQL)",
        "type": "recommended",
        "description": "SQL is the universal query language to extract, filter, join, and aggregate structured data from relational databases.",
        "whyLearn": "SQL is tested in almost 100% of data science and analytics interviews; companies store their operational data in SQL tables.",
        "subtopics": [
          "SELECT, WHERE, ORDER BY, LIMIT",
          "Aggregate functions: COUNT, SUM, AVG, MIN, MAX with GROUP BY / HAVING",
          "Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS JOIN",
          "Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD()",
          "Subqueries & Common Table Expressions (WITH clauses)"
        ],
        "resources": [
          {
            "title": "Mode Analytics SQL Tutorial",
            "url": "https://mode.com/sql-tutorial/",
            "type": "Interactive Guide"
          },
          {
            "title": "PostgreSQL Official Documentation",
            "url": "https://www.postgresql.org/docs/",
            "type": "Documentation"
          }
        ],
        "challenge": "Write a SQL query using Window Functions (RANK() and LAG()) to calculate month-over-month revenue growth by product category."
      },
      {
        "id": "data-stats",
        "stage": 1,
        "stageTitle": "Phase 1: Programming & Math Basics",
        "title": "Probability & Applied Statistics",
        "type": "recommended",
        "description": "The mathematical engine behind hypothesis testing, experimental design, regression analysis, and risk modeling.",
        "whyLearn": "Statistics prevents you from making false conclusions or confusing random noise with real signals.",
        "subtopics": [
          "Descriptive statistics: Mean, Median, Mode, Variance, Standard Deviation, IQR",
          "Probability distributions: Normal, Binomial, Poisson",
          "Central Limit Theorem & Law of Large Numbers",
          "Hypothesis testing: Z-test, t-test, ANOVA, Chi-Square",
          "P-values, Type I / Type II errors, and confidence intervals"
        ],
        "resources": [
          {
            "title": "StatQuest: Statistics Fundamentals",
            "url": "https://statquest.org/",
            "type": "Video Series"
          },
          {
            "title": "OpenIntro Statistics (Free Textbook)",
            "url": "https://www.openintro.org/book/os/",
            "type": "Book"
          }
        ],
        "challenge": "Conduct a two-sample t-test in Python (scipy.stats) on an A/B testing dataset to determine if a website change is statistically significant."
      },
      {
        "id": "data-pandas",
        "stage": 2,
        "stageTitle": "Phase 2: Data Wrangling & Manipulation",
        "title": "Pandas Data Manipulation",
        "type": "recommended",
        "description": "The industry workhorse for tabular data manipulation, filtering, merging, and time-series resampling.",
        "whyLearn": "Practitioners spend more than half their day reshaping dataframes with Pandas before running any analytics.",
        "subtopics": [
          "DataFrame slicing, indexing, and Boolean masking (.loc, .iloc)",
          "Handling dates and time-series (pd.to_datetime, resample)",
          "Pivoting and melting tables (pivot_table, melt)",
          "String manipulation with .str vector methods",
          "Applying custom functions with .apply() and lambda"
        ],
        "resources": [
          {
            "title": "10 Minutes to pandas",
            "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
            "type": "Guide"
          }
        ],
        "challenge": "Clean and reshape a messy multi-table sales spreadsheet into a clean, normalized star-schema dataframe ready for dashboarding."
      },
      {
        "id": "data-bi",
        "stage": 2,
        "stageTitle": "Phase 2: Data Wrangling & Manipulation",
        "title": "BI Tools (Tableau / Power BI)",
        "type": "alternative",
        "description": "Business Intelligence platforms that turn data into executive dashboards, automated reports, and interactive charts.",
        "whyLearn": "Executives and business stakeholders consume insights via visual interactive BI dashboards, not Jupyter notebooks.",
        "subtopics": [
          "Connecting to SQL databases and cloud warehouses",
          "Building interactive bar, line, scatter, and map charts",
          "Calculated fields and DAX / LOD expressions",
          "Dashboard layout design, filtering, and cross-highlighting",
          "Automated scheduled report refreshes"
        ],
        "resources": [
          {
            "title": "Tableau Free Training Videos",
            "url": "https://www.tableau.com/learn/training",
            "type": "Video Series"
          },
          {
            "title": "Microsoft Power BI Documentation",
            "url": "https://learn.microsoft.com/en-us/power-bi/",
            "type": "Documentation"
          }
        ],
        "challenge": "Build an interactive 3-page executive dashboard with drill-down filters showing sales performance, customer churn, and regional metrics."
      },
      {
        "id": "data-ml-analytics",
        "stage": 3,
        "stageTitle": "Phase 3: Machine Learning & Predictive Modeling",
        "title": "Predictive Modeling (Scikit-Learn)",
        "type": "recommended",
        "description": "Supervised regression and classification models to predict future trends, customer churn, and sales forecasting.",
        "whyLearn": "Moves beyond explaining what happened in the past to predicting what will happen in the future.",
        "subtopics": [
          "Linear & Logistic Regression for interpretable baselines",
          "Tree models: Decision Trees, Random Forests, LightGBM",
          "Cross-validation and hyperparameter tuning with GridSearchCV",
          "Feature importance and model interpretability with SHAP",
          "Time-series forecasting with ARIMA / Prophet"
        ],
        "resources": [
          {
            "title": "Scikit-Learn Official User Guide",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "type": "Documentation"
          }
        ],
        "challenge": "Train a Random Forest classifier to predict customer churn, explain the top 5 predictive factors using SHAP values, and evaluate AUC-ROC."
      },
      {
        "id": "data-warehouse",
        "stage": 4,
        "stageTitle": "Phase 4: Modern Data Stack & Warehousing",
        "title": "Cloud Data Warehouses (Snowflake / BigQuery)",
        "type": "recommended",
        "description": "Massively parallel processing (MPP) analytical databases built for querying petabytes of data in seconds.",
        "whyLearn": "Modern data stacks have centered entirely on cloud warehouses like Snowflake, Google BigQuery, and Databricks.",
        "subtopics": [
          "Columnar storage vs row-oriented storage",
          "Partitioning and clustering for query optimization",
          "Snowflake architecture (Storage, Virtual Warehouses, Cloud Services)",
          "Google BigQuery serverless querying & BigQuery ML",
          "Cost optimization and query execution plans (EXPLAIN)"
        ],
        "resources": [
          {
            "title": "Google BigQuery Documentation",
            "url": "https://cloud.google.com/bigquery/docs",
            "type": "Documentation"
          },
          {
            "title": "Snowflake Hands-On Essentials",
            "url": "https://quickstarts.snowflake.com/",
            "type": "Tutorial"
          }
        ],
        "challenge": "Upload a public dataset to BigQuery or Snowflake, write an optimized partitioned query, and inspect the query plan to verify zero full table scans."
      },
      {
        "id": "data-dbt",
        "stage": 4,
        "stageTitle": "Phase 4: Modern Data Stack & Warehousing",
        "title": "dbt (Data Build Tool)",
        "type": "recommended",
        "description": "The industry standard transformation tool that brings software engineering best practices (version control, testing, CI/CD) to SQL.",
        "whyLearn": "dbt transforms raw data inside your warehouse using clean, modular, testable SELECT statements.",
        "subtopics": [
          "dbt models and modular SQL architecture (staging, intermediate, marts)",
          "Jinja templating and {{ ref('table') }} dependencies",
          "Automated data tests (unique, not_null, accepted_values)",
          "Generating automated interactive documentation and lineage graphs",
          "dbt Cloud vs dbt Core CLI workflows"
        ],
        "resources": [
          {
            "title": "dbt Learn: Getting Started with dbt Core",
            "url": "https://courses.getdbt.com/",
            "type": "Free Course"
          },
          {
            "title": "dbt Documentation",
            "url": "https://docs.getdbt.com/",
            "type": "Documentation"
          }
        ],
        "challenge": "Create a dbt project that takes raw staging tables, transforms them into dimensional marts, and runs automated unique/not_null tests."
      },
      {
        "id": "data-spark",
        "stage": 5,
        "stageTitle": "Phase 5: Big Data & Streaming",
        "title": "Apache Spark & PySpark",
        "type": "optional",
        "description": "Distributed cluster computing framework designed to process and analyze massive datasets that exceed single-machine memory.",
        "whyLearn": "Essential for working with terabytes or petabytes of streaming logs, clicks, and IoT events at Fortune 500 scale.",
        "subtopics": [
          "Spark architecture: Driver, Executors, Cluster Manager",
          "PySpark DataFrame API and SQL transformations",
          "Lazy evaluation, RDDs, transformations vs actions",
          "Handling data skew and shuffle partitions",
          "Streaming data with Spark Structured Streaming"
        ],
        "resources": [
          {
            "title": "Apache Spark Official Quick Start",
            "url": "https://spark.apache.org/docs/latest/quick-start.html",
            "type": "Documentation"
          }
        ],
        "challenge": "Process a 10GB multi-file dataset using PySpark, performing distributed aggregations and outputting partitioned Parquet files."
      }
    ]
  },
  "web": {
    "title": "Full-Stack Web Developer",
    "description": "Step by step guide to becoming a modern Full-Stack Web Developer in 2026",
    "nodes": [
      {
        "id": "web-internet",
        "stage": 1,
        "stageTitle": "Phase 1: Internet & Frontend Foundations",
        "title": "How the Internet Works",
        "type": "recommended",
        "description": "Understand DNS lookup, HTTP/HTTPS protocols, TCP/IP handshakes, browsers, and client-server architectures.",
        "whyLearn": "Every web request, asset load, and API call relies on these fundamentals; debugging web issues starts with the network.",
        "subtopics": [
          "How browsers render HTML, CSS, and execute JavaScript",
          "DNS (Domain Name System) lookup and IP routing",
          "HTTP request-response cycle and status codes (2xx, 3xx, 4xx, 5xx)",
          "TLS/SSL certificates and secure HTTPS connections"
        ],
        "resources": [
          {
            "title": "MDN: How the Web Works",
            "url": "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanisms/How_does_the_Internet_work",
            "type": "Guide"
          },
          {
            "title": "roadmap.sh: How does the Internet Work?",
            "url": "https://roadmap.sh/guides/what-is-internet",
            "type": "Article"
          }
        ],
        "challenge": "Use Chrome DevTools Network Tab to inspect every request, response header, and timing breakdown for a live website."
      },
      {
        "id": "web-html-css",
        "stage": 1,
        "stageTitle": "Phase 1: Internet & Frontend Foundations",
        "title": "HTML5 & Modern CSS",
        "type": "recommended",
        "description": "HTML structures the content semantically; CSS designs the layout, typography, colors, animations, and responsive behavior.",
        "whyLearn": "The universal language of user interfaces on the web. Accessible, clean semantic markup is essential for usability and SEO.",
        "subtopics": [
          "Semantic HTML5 (<header>, <nav>, <main>, <article>, <section>, <footer>)",
          "CSS Box Model (content, padding, border, margin)",
          "CSS Flexbox for flexible 1D alignment",
          "CSS Grid for responsive 2D layouts",
          "Media Queries (@media) and mobile-first responsive design"
        ],
        "resources": [
          {
            "title": "MDN Web Docs: Learn HTML",
            "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML",
            "type": "Documentation"
          },
          {
            "title": "CSS-Tricks: A Complete Guide to Flexbox",
            "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            "type": "Visual Guide"
          }
        ],
        "challenge": "Build a responsive portfolio landing page from scratch with a navigation bar, hero section, project grid, and contact form without any frameworks."
      },
      {
        "id": "web-javascript",
        "stage": 2,
        "stageTitle": "Phase 2: JavaScript Mastery",
        "title": "Modern JavaScript (ES6+)",
        "type": "recommended",
        "description": "The programming language that powers interactive web pages, handles user events, manages state, and talks to backend APIs.",
        "whyLearn": "JavaScript is the single most widely used language in the world, running on both client browsers and Node.js servers.",
        "subtopics": [
          "ES6+ syntax: let/const, arrow functions, destructuring, template literals, spread/rest",
          "DOM manipulation & event listeners (click, input, submit)",
          "Asynchronous JS: Event Loop, Callbacks, Promises, and async/await",
          "Fetch API for calling RESTful endpoints",
          "ES Modules (import/export)"
        ],
        "resources": [
          {
            "title": "javascript.info: The Modern JavaScript Tutorial",
            "url": "https://javascript.info/",
            "type": "Interactive Book"
          },
          {
            "title": "MDN: JavaScript First Steps",
            "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript",
            "type": "Documentation"
          }
        ],
        "challenge": "Build an interactive Weather Dashboard in vanilla JS that queries the OpenWeatherMap API with async/await, handles loading states, and updates the DOM."
      },
      {
        "id": "web-git",
        "stage": 2,
        "stageTitle": "Phase 2: JavaScript Mastery",
        "title": "Git & GitHub Collaboration",
        "type": "recommended",
        "description": "Version control system to track file revisions, collaborate across engineering teams, and manage release branches.",
        "whyLearn": "No software engineer works in isolation; professional teams rely on Git branches and code reviews to merge software safely.",
        "subtopics": [
          "git init, clone, add, commit, push, pull",
          "Branching (git checkout -b feature), merging, and rebase basics",
          "Resolving merge conflicts calmly",
          "GitHub Pull Requests, code review comments, and branch protection rules"
        ],
        "resources": [
          {
            "title": "Pro Git Book (Free)",
            "url": "https://git-scm.com/book/en/v2",
            "type": "Book"
          }
        ],
        "challenge": "Create a GitHub repo for your projects, branch off to build a feature, commit twice, and merge via a GitHub Pull Request."
      },
      {
        "id": "web-tailwind",
        "stage": 2,
        "stageTitle": "Phase 2: JavaScript Mastery",
        "title": "Tailwind CSS",
        "type": "recommended",
        "description": "A utility-first CSS framework that lets you build modern, beautiful responsive designs directly inside your markup.",
        "whyLearn": "Tailwind dramatically accelerates frontend UI development speed and avoids gigantic messy custom CSS stylesheets.",
        "subtopics": [
          "Utility classes: flex, grid, gap, p-4, m-2, rounded-xl",
          "Responsive prefixes: sm:, md:, lg:, xl:",
          "Hover, focus, and active interactive pseudo-classes",
          "Dark mode (dark: class configuration)",
          "Tailwind configuration (tailwind.config.js) and custom themes"
        ],
        "resources": [
          {
            "title": "Tailwind CSS Official Documentation",
            "url": "https://tailwindcss.com/docs",
            "type": "Documentation"
          }
        ],
        "challenge": "Re-style your portfolio landing page using Tailwind CSS, including dark mode support and responsive mobile navigation drawer."
      },
      {
        "id": "web-react",
        "stage": 3,
        "stageTitle": "Phase 3: Modern Frontend Frameworks",
        "title": "React.js Component Architecture",
        "type": "recommended",
        "description": "The dominant frontend library for building component-based, high-performance single-page applications (SPAs).",
        "whyLearn": "React has the largest job market share, the richest component ecosystem, and universal support across developer tools.",
        "subtopics": [
          "Functional components & JSX syntax",
          "State with useState and side-effects with useEffect",
          "Component Props, children, and component composition",
          "Custom hooks for reusable logic",
          "Client-side routing with React Router"
        ],
        "resources": [
          {
            "title": "React Official Documentation (New Docs)",
            "url": "https://react.dev/",
            "type": "Documentation"
          },
          {
            "title": "freeCodeCamp: Learn React 19",
            "url": "https://www.freecodecamp.org/news/learn-react-19/",
            "type": "Tutorial"
          }
        ],
        "challenge": "Build a responsive Task Management / Kanban board in React with state management, custom hooks, and localStorage persistence."
      },
      {
        "id": "web-vue",
        "stage": 3,
        "stageTitle": "Phase 3: Modern Frontend Frameworks",
        "title": "Vue.js (Alternative)",
        "type": "alternative",
        "description": "An approachable, performant, and versatile frontend framework with clean single-file components (.vue).",
        "whyLearn": "Popular worldwide for its intuitive template syntax, reactivity system, and official tooling (Pinia, Vue Router).",
        "subtopics": [
          "Vue Single File Components (<template>, <script>, <style>)",
          "Reactivity system: ref() and reactive()",
          "Directives: v-if, v-for, v-model, @click",
          "Computed properties & watchers",
          "Pinia state store management"
        ],
        "resources": [
          {
            "title": "Vue.js Official Guide",
            "url": "https://vuejs.org/guide/introduction.html",
            "type": "Documentation"
          }
        ],
        "challenge": "Implement a reactive shopping cart in Vue 3 using the Composition API with reactive totals and tax calculations."
      },
      {
        "id": "web-nodejs",
        "stage": 4,
        "stageTitle": "Phase 4: Backend Engineering & APIs",
        "title": "Node.js & Express.js Backend",
        "type": "recommended",
        "description": "JavaScript on the server! Build fast, scalable REST APIs, handle database queries, and process user authentication.",
        "whyLearn": "Full-stack developers can use a single language (JavaScript/TypeScript) across both frontend and backend.",
        "subtopics": [
          "Node.js runtime, event loop, and npm packages",
          "Express.js routing (app.get, app.post, app.put, app.delete)",
          "Middleware architecture (logging, JSON body-parser, CORS, error handling)",
          "Environment variables with dotenv (.env)",
          "Writing clean RESTful JSON endpoints"
        ],
        "resources": [
          {
            "title": "Node.js Official Getting Started",
            "url": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
            "type": "Guide"
          },
          {
            "title": "Express.js Official Guide",
            "url": "https://expressjs.com/en/starter/installing.html",
            "type": "Documentation"
          }
        ],
        "challenge": "Build a complete CRUD REST API in Express for an e-commerce catalog with input validation and error middleware."
      },
      {
        "id": "web-databases",
        "stage": 4,
        "stageTitle": "Phase 4: Backend Engineering & APIs",
        "title": "PostgreSQL & Prisma ORM",
        "type": "recommended",
        "description": "PostgreSQL is the gold-standard relational database; Prisma is a modern TypeScript ORM for safe, clean queries.",
        "whyLearn": "Production applications require dependable database persistence with relational joins, indexes, and migrations.",
        "subtopics": [
          "Relational database modeling (1:1, 1:N, N:M relationships)",
          "Prisma Schema definition (schema.prisma)",
          "Running database migrations (prisma migrate dev)",
          "Querying with Prisma Client (findMany, create, update, delete)",
          "Indexing columns for query performance"
        ],
        "resources": [
          {
            "title": "Prisma Quickstart Guide",
            "url": "https://www.prisma.io/docs/getting-started/quickstart-prisma",
            "type": "Documentation"
          }
        ],
        "challenge": "Connect your Express API to a PostgreSQL database using Prisma, define models for Users and Posts, and write migration scripts."
      },
      {
        "id": "web-auth",
        "stage": 5,
        "stageTitle": "Phase 5: Authentication & Security",
        "title": "JWT & Session Authentication",
        "type": "recommended",
        "description": "Securely register users, hash passwords with bcrypt, issue signed JSON Web Tokens (JWT), and protect private routes.",
        "whyLearn": "Every real-world web application requires authentication (who you are) and authorization (what you are allowed to access).",
        "subtopics": [
          "Password hashing with bcrypt / argon2 (never store plain text!)",
          "Generating and signing JSON Web Tokens (JWT)",
          "Storing tokens safely (HttpOnly secure cookies vs headers)",
          "Authentication middleware protecting private API routes",
          "Role-Based Access Control (Admin vs Regular User)"
        ],
        "resources": [
          {
            "title": "OWASP Password Storage Cheat Sheet",
            "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
            "type": "Security Guide"
          }
        ],
        "challenge": "Implement a secure signup and login flow with bcrypt password hashing, JWT cookie authentication, and an /api/profile protected route."
      },
      {
        "id": "web-deployment",
        "stage": 6,
        "stageTitle": "Phase 6: DevOps, Testing & Production",
        "title": "Docker & Cloud Deployment",
        "type": "recommended",
        "description": "Package your full-stack app into Docker containers and deploy to cloud platforms (Vercel, Render, Railway, AWS).",
        "whyLearn": "A web project isn't finished until it is deployed live on a public domain with SSL certificates and automatic Git deployments.",
        "subtopics": [
          "Writing a production Dockerfile for Node/React",
          "Multi-stage Docker builds to minimize image sizes",
          "Deploying frontend to Vercel or Netlify with custom domain",
          "Deploying backend API to Render or AWS ECS",
          "Setting up GitHub Actions for continuous deployment (CI/CD)"
        ],
        "resources": [
          {
            "title": "Docker for Web Developers Tutorial",
            "url": "https://docs.docker.com/get-started/",
            "type": "Tutorial"
          }
        ],
        "challenge": "Containerize your full-stack web application with Docker and deploy the live site on Vercel and Render with automatic GitHub CI/CD."
      }
    ]
  },
  "security": {
    "title": "Cybersecurity Specialist & Ethical Hacker",
    "description": "Step by step guide to becoming a Cybersecurity Specialist, Penetration Tester, and Security Analyst in 2026",
    "nodes": [
      {
        "id": "sec-networking",
        "stage": 1,
        "stageTitle": "Phase 1: Systems & Networking Fundamentals",
        "title": "Networking & TCP/IP Deep Dive",
        "type": "recommended",
        "description": "Understand packet structures, IP routing, subnetting, DNS, and protocols to analyze and defend network traffic.",
        "whyLearn": "You cannot defend a network or find network vulnerabilities if you don't understand how packets move across wires.",
        "subtopics": [
          "OSI 7-Layer model & TCP/IP stack mapping",
          "TCP 3-way handshake (SYN, SYN-ACK, ACK) and teardown",
          "IPv4/IPv6 addressing, CIDR subnetting, and NAT",
          "Core protocols: DNS, DHCP, HTTP/HTTPS, SSH, FTP, ICMP",
          "Wireshark packet capture & protocol inspection"
        ],
        "resources": [
          {
            "title": "Professor Messer's CompTIA Network+ Course (Free)",
            "url": "https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/",
            "type": "Video Series"
          },
          {
            "title": "Wireshark User's Guide",
            "url": "https://www.wireshark.org/docs/wsug_html_chunked/",
            "type": "Documentation"
          }
        ],
        "challenge": "Capture live web traffic with Wireshark, filter by 'http' or 'dns', and trace a full TCP handshake between your PC and a server."
      },
      {
        "id": "sec-linux",
        "stage": 1,
        "stageTitle": "Phase 1: Systems & Networking Fundamentals",
        "title": "Linux Administration & Bash Scripting",
        "type": "recommended",
        "description": "The primary operating system of cybersecurity. Security tools (Kali Linux), servers, and cloud infrastructure run on Linux.",
        "whyLearn": "Nearly all serious security tools, exploit payloads, and server defense scripts run on Linux command-line terminals.",
        "subtopics": [
          "Linux file hierarchy and permission bits (chmod, chown)",
          "Process monitoring (ps, top, systemctl, kill)",
          "Networking tools: ifconfig/ip, netstat/ss, iptables, ufw",
          "Bash automation scripting (loops, conditionals, grep, awk, sed)",
          "SSH key-based remote server authentication"
        ],
        "resources": [
          {
            "title": "OverTheWire: Bandit (Gamified Linux Security Wargame)",
            "url": "https://overthewire.org/wargames/bandit/",
            "type": "Interactive Wargame"
          },
          {
            "title": "Linux Journey (Free Interactive)",
            "url": "https://linuxjourney.com/",
            "type": "Interactive Tutorial"
          }
        ],
        "challenge": "Play and complete the first 15 levels of OverTheWire Bandit wargame, learning Linux terminal commands under security constraints."
      },
      {
        "id": "sec-crypto",
        "stage": 2,
        "stageTitle": "Phase 2: Cryptography & Identity Security",
        "title": "Applied Cryptography & PKI",
        "type": "recommended",
        "description": "Learn how modern encryption, hashing, digital signatures, and public key infrastructure (PKI) protect digital information.",
        "whyLearn": "Cryptography is the mathematical bedrock of data confidentiality, authentication, and tamper-proof digital signatures.",
        "subtopics": [
          "Symmetric encryption (AES-256) vs Asymmetric encryption (RSA, ECC)",
          "Cryptographic hashing: SHA-256, bcrypt, password salting",
          "Public Key Infrastructure (PKI), Certificate Authorities, and X.509",
          "TLS 1.3 handshake and browser HTTPS encryption",
          "Common attacks: Rainbow Tables, replay attacks, padding oracle"
        ],
        "resources": [
          {
            "title": "Khan Academy: Cryptography Course (Free)",
            "url": "https://www.khanacademy.org/computing/computer-science/cryptography",
            "type": "Course"
          }
        ],
        "challenge": "Use OpenSSL CLI to generate an RSA 2048-bit keypair, encrypt a confidential text file with the public key, and decrypt it with the private key."
      },
      {
        "id": "sec-web",
        "stage": 3,
        "stageTitle": "Phase 3: Web Application Security",
        "title": "OWASP Top 10 Web Vulnerabilities",
        "type": "recommended",
        "description": "The Open Worldwide Application Security Project (OWASP) Top 10 is the global consensus standard on critical web vulnerabilities.",
        "whyLearn": "Web applications are the #1 target for remote hackers looking to compromise corporate databases and exfiltrate credentials.",
        "subtopics": [
          "SQL Injection (SQLi) & Parameterized query defense",
          "Cross-Site Scripting (XSS: Stored, Reflected, DOM)",
          "Cross-Site Request Forgery (CSRF) & SameSite cookies",
          "Broken Object Level Authorization (BOLA / IDOR)",
          "Security misconfigurations and sensitive data exposure"
        ],
        "resources": [
          {
            "title": "PortSwigger Web Security Academy (Free Lab Labs)",
            "url": "https://portswigger.net/web-security",
            "type": "Interactive Labs"
          },
          {
            "title": "OWASP Top 10 Project",
            "url": "https://owasp.org/www-project-top-ten/",
            "type": "Documentation"
          }
        ],
        "challenge": "Complete the SQL Injection and XSS apprentice labs on PortSwigger Web Security Academy using Burp Suite community edition."
      },
      {
        "id": "sec-pentest",
        "stage": 4,
        "stageTitle": "Phase 4: Offensive Security & Ethical Hacking",
        "title": "Penetration Testing & Tools",
        "type": "recommended",
        "description": "Learn ethical hacking methodologies, reconnaissance, port scanning, vulnerability exploitation, and reporting.",
        "whyLearn": "Security engineers must think like attackers to uncover vulnerabilities before malicious black-hat hackers find them.",
        "subtopics": [
          "Reconnaissance & OSINT (Shodan, whois, DNS recon)",
          "Port and service scanning with Nmap (SYN scan, service versioning)",
          "Web vulnerability interception with Burp Suite proxy",
          "Metasploit Framework for exploit validation",
          "Writing professional remediation and penetration test reports"
        ],
        "resources": [
          {
            "title": "TryHackMe: Pre-Security & Complete Beginner Paths",
            "url": "https://tryhackme.com/",
            "type": "Interactive Labs"
          },
          {
            "title": "Hack The Box: Starting Point",
            "url": "https://www.hackthebox.com/",
            "type": "Interactive Labs"
          }
        ],
        "challenge": "Deploy a legal vulnerable lab machine on TryHackMe, run an Nmap scan to enumerate open ports, exploit an identified service, and capture the flag."
      },
      {
        "id": "sec-blue-soc",
        "stage": 5,
        "stageTitle": "Phase 5: Defensive Security & SOC Operations",
        "title": "Security Operations & Incident Response",
        "type": "recommended",
        "description": "Blue team defense: monitoring networks, analyzing SIEM event logs, hunting threats, and responding to cyber incidents.",
        "whyLearn": "Most entry-level cybersecurity jobs start in a Security Operations Center (SOC) analyzing real-time security alerts.",
        "subtopics": [
          "SIEM tools: Splunk, Elastic Security, Microsoft Sentinel",
          "Endpoint Detection and Response (EDR) agents",
          "Analyzing suspicious log files (auth.log, Windows Event ID 4624/4625)",
          "Incident Response lifecycle (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned)",
          "MITRE ATT&CK framework mapping"
        ],
        "resources": [
          {
            "title": "Splunk Free Training Courses",
            "url": "https://www.splunk.com/en_us/training/free-courses/overview.html",
            "type": "Free Training"
          },
          {
            "title": "MITRE ATT&CK Framework Navigator",
            "url": "https://attack.mitre.org/",
            "type": "Tool"
          }
        ],
        "challenge": "Set up a free Splunk or Elastic instance, ingest Apache/Windows security logs, write a search query to detect brute-force login attempts, and configure an automated alert."
      }
    ]
  },
  "cloud": {
    "title": "Cloud Architect & DevOps Engineer",
    "description": "Step by step guide to becoming a Cloud Architect and DevOps / SRE Engineer in 2026",
    "nodes": [
      {
        "id": "cloud-linux-git",
        "stage": 1,
        "stageTitle": "Phase 1: Foundations & Scripting",
        "title": "Linux & Shell Scripting for DevOps",
        "type": "recommended",
        "description": "Command-line Linux administration, process management, and Bash automation scripting are non-negotiable DevOps skills.",
        "whyLearn": "All cloud servers, Docker containers, and Kubernetes pods run on Linux distributions.",
        "subtopics": [
          "SSH remote access, key management, and SCP/rsync",
          "File permissions (chmod, chown), systemd services, and cron jobs",
          "Bash scripting: loops, arguments, exit codes, and functions",
          "Package managers (apt, yum/dnf, apk)",
          "Text stream filtering with grep, awk, sed, and jq"
        ],
        "resources": [
          {
            "title": "Linux Journey",
            "url": "https://linuxjourney.com/",
            "type": "Interactive Tutorial"
          }
        ],
        "challenge": "Write a Bash script that automatically monitors server disk usage and RAM, logs an alert if usage exceeds 85%, and runs daily via cron."
      },
      {
        "id": "cloud-docker",
        "stage": 2,
        "stageTitle": "Phase 2: Containerization",
        "title": "Docker & Containers",
        "type": "recommended",
        "description": "Package applications with all dependencies into lightweight, portable, reproducible container images.",
        "whyLearn": "Solves the 'it works on my machine' problem permanently; the foundation of modern cloud-native deployment.",
        "subtopics": [
          "Docker architecture: Daemon, Images, Containers, Registry",
          "Writing clean Dockerfiles (FROM, WORKDIR, COPY, RUN, CMD)",
          "Multi-stage builds to produce tiny production images",
          "Docker Compose for local multi-container development",
          "Container networking and persistent named volumes"
        ],
        "resources": [
          {
            "title": "Docker Official Get Started",
            "url": "https://docs.docker.com/get-started/",
            "type": "Documentation"
          }
        ],
        "challenge": "Write a multi-stage Dockerfile that builds a Node or Go web service, reduces the final image size to <30MB using Alpine, and runs it with Docker Compose."
      },
      {
        "id": "cloud-provider",
        "stage": 3,
        "stageTitle": "Phase 3: Cloud Infrastructure (AWS / GCP / Azure)",
        "title": "AWS Cloud Core Services",
        "type": "recommended",
        "description": "Master the #1 global cloud provider: compute (EC2), storage (S3), networking (VPC), and identity (IAM).",
        "whyLearn": "AWS commands the largest enterprise market share; mastering AWS translates directly into production cloud capability.",
        "subtopics": [
          "IAM: Users, Groups, Roles, Policies, and Least Privilege",
          "Compute: EC2 instances, Security Groups, Key Pairs, AMIs",
          "Storage: S3 buckets, lifecycle policies, and EBS volumes",
          "Networking: Virtual Private Cloud (VPC), Subnets, Route Tables, Internet Gateways",
          "Databases: Amazon RDS (PostgreSQL/MySQL) with managed backups"
        ],
        "resources": [
          {
            "title": "AWS Skill Builder: Cloud Practitioner Essentials (Free)",
            "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials",
            "type": "Free Course"
          },
          {
            "title": "AWS Free Tier Account",
            "url": "https://aws.amazon.com/free/",
            "type": "Hands-On"
          }
        ],
        "challenge": "Create an AWS Free Tier account, provision a custom VPC with public and private subnets, and launch a secure EC2 web server behind a security group."
      },
      {
        "id": "cloud-iac",
        "stage": 4,
        "stageTitle": "Phase 4: Infrastructure as Code (IaC)",
        "title": "Terraform Infrastructure as Code",
        "type": "recommended",
        "description": "Write declarative configuration files to provision, update, and destroy cloud infrastructure across any provider.",
        "whyLearn": "Manual clicking in cloud web consoles is error-prone and prohibited in enterprise production; everything must be code.",
        "subtopics": [
          "HCL (HashiCorp Configuration Language) syntax and blocks",
          "Terraform core workflow: init, plan, apply, destroy",
          "State management: local state vs remote backend (S3 + DynamoDB locking)",
          "Variables, outputs, and reusable Terraform Modules",
          "Detecting and resolving infrastructure drift"
        ],
        "resources": [
          {
            "title": "HashiCorp Learn: Terraform Getting Started",
            "url": "https://developer.hashicorp.com/terraform/tutorials",
            "type": "Interactive Guide"
          }
        ],
        "challenge": "Write a modular Terraform configuration that provisions an S3 bucket, an EC2 instance, and associated security groups automatically with zero console clicks."
      },
      {
        "id": "cloud-cicd",
        "stage": 4,
        "stageTitle": "Phase 4: Infrastructure as Code (IaC)",
        "title": "CI/CD with GitHub Actions",
        "type": "recommended",
        "description": "Automate testing, linting, building Docker images, and deploying code to cloud servers whenever git commits are pushed.",
        "whyLearn": "Enables teams to deploy code changes dozens of times per day safely with automated rollback and zero downtime.",
        "subtopics": [
          "GitHub Actions workflow files (.github/workflows/*.yml)",
          "Triggers (on: push, pull_request, schedule)",
          "Jobs, steps, and using marketplace actions",
          "Storing sensitive deployment secrets in GitHub Secrets",
          "Automated building and pushing Docker images to Docker Hub / ECR"
        ],
        "resources": [
          {
            "title": "GitHub Actions Official Documentation",
            "url": "https://docs.github.com/en/actions",
            "type": "Documentation"
          }
        ],
        "challenge": "Create a GitHub Actions pipeline that automatically tests your code on pull requests, builds a Docker image on main branch merge, and pushes to a container registry."
      },
      {
        "id": "cloud-k8s",
        "stage": 5,
        "stageTitle": "Phase 5: Container Orchestration & Scaling",
        "title": "Kubernetes (K8s)",
        "type": "recommended",
        "description": "The industry-standard container orchestration engine that manages scaling, self-healing, load balancing, and rolling updates.",
        "whyLearn": "Kubernetes is the operating system of the modern cloud, used across enterprise microservices infrastructure.",
        "subtopics": [
          "K8s architecture: Control Plane (API server, etcd, scheduler) & Worker Nodes (kubelet, kube-proxy)",
          "Pods, Deployments, and ReplicaSets",
          "Services: ClusterIP, NodePort, and LoadBalancer",
          "ConfigMaps and Secrets for environment injection",
          "Ingress Controllers for routing external HTTP traffic"
        ],
        "resources": [
          {
            "title": "Kubernetes Official Interactive Basics",
            "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
            "type": "Interactive Tutorial"
          },
          {
            "title": "Nana Janashia: Kubernetes 101 Course",
            "url": "https://www.youtube.com/watch?v=X48VuDVv0do",
            "type": "Video Series"
          }
        ],
        "challenge": "Install Minikube locally, deploy a 3-replica web deployment, expose it with a Service, and execute a zero-downtime rolling update."
      }
    ]
  },
  "iot": {
    "title": "IoT & Embedded Systems Engineer",
    "description": "Step by step guide to becoming an Internet of Things and Embedded Firmware Engineer in 2026",
    "nodes": [
      {
        "id": "iot-c-cpp",
        "stage": 1,
        "stageTitle": "Phase 1: Embedded C & Electronics",
        "title": "Embedded C / C++ Programming",
        "type": "recommended",
        "description": "C and C++ are the foundational languages of embedded microcontrollers, offering direct hardware access and tiny memory footprint.",
        "whyLearn": "Embedded microchips have kilobytes of RAM and no operating system; C gives direct control over registers and bit manipulation.",
        "subtopics": [
          "Pointers, memory addresses, and pointer arithmetic",
          "Bitwise operators (&, |, ^, ~, <<, >>) and bit masking",
          "Structs, typedefs, and memory-mapped hardware registers",
          "Static vs dynamic memory allocation (avoiding malloc in firmware)",
          "Interrupt Service Routines (ISRs) and volatile keyword"
        ],
        "resources": [
          {
            "title": "Embedded Systems - Shape the World (edX/UT Austin)",
            "url": "https://www.edx.org/",
            "type": "Free Course"
          }
        ],
        "challenge": "Write an embedded C program that configures a microcontroller register using bitwise masking to toggle a GPIO pin at 1Hz without using delay() libraries."
      },
      {
        "id": "iot-electronics",
        "stage": 1,
        "stageTitle": "Phase 1: Embedded C & Electronics",
        "title": "Electronics & Circuit Design",
        "type": "recommended",
        "description": "Learn breadboarding, Ohm's law, digital multimeters, oscilloscope measurements, and reading electronic schematics.",
        "whyLearn": "Embedded software interacts directly with physical electrons; you must understand circuit laws to avoid burning hardware.",
        "subtopics": [
          "Ohm's Law (V = I * R) and resistor calculations for LEDs",
          "Pull-up and pull-down resistors for digital button inputs",
          "Diodes, capacitors, and transistor switching (BJT and MOSFET)",
          "Using a digital multimeter to measure voltage, current, and continuity",
          "Reading component datasheets and electrical pinouts"
        ],
        "resources": [
          {
            "title": "All About Circuits: Free Video & Textbook Series",
            "url": "https://www.allaboutcircuits.com/textbook/",
            "type": "Open Textbook"
          }
        ],
        "challenge": "Assemble a circuit on a breadboard connecting a pushbutton with a 10k pull-up resistor, verifying stable 0V and 3.3V logic states on a multimeter."
      },
      {
        "id": "iot-esp32",
        "stage": 2,
        "stageTitle": "Phase 2: Microcontroller Platforms & Protocols",
        "title": "ESP32 & Arduino Platform",
        "type": "recommended",
        "description": "The ESP32 is the king of inexpensive IoT development, featuring dual 240MHz 32-bit cores, built-in Wi-Fi, and Bluetooth BLE.",
        "whyLearn": "Industry standard for IoT prototypes, smart home devices, and wireless industrial sensor nodes.",
        "subtopics": [
          "Setting up VS Code with PlatformIO / Arduino IDE",
          "Configuring GPIO pins for input, output, and analog ADC reading",
          "PWM (Pulse Width Modulation) for LED dimming and servo motor control",
          "Hardware timers and external GPIO interrupt handlers",
          "Flash storage (SPIFFS / LittleFS) and Non-Volatile Storage (NVS)"
        ],
        "resources": [
          {
            "title": "Random Nerd Tutorials: ESP32 Master Guides",
            "url": "https://randomnerdtutorials.com/projects-esp32/",
            "type": "Hands-On Guides"
          }
        ],
        "challenge": "Program an ESP32 to read an analog temperature sensor, trigger an interrupt when a button is pressed, and log readings over the serial monitor."
      },
      {
        "id": "iot-buses",
        "stage": 2,
        "stageTitle": "Phase 2: Microcontroller Platforms & Protocols",
        "title": "Serial Hardware Protocols (I2C, SPI, UART)",
        "type": "recommended",
        "description": "The standard electronic buses used to connect sensors, displays, memory chips, and GPS modules to a microcontroller.",
        "whyLearn": "Every sensor in the real world communicates over I2C, SPI, or UART serial lines.",
        "subtopics": [
          "UART: TX/RX lines, baud rate synchronization, and framing",
          "I2C: 2-wire serial bus (SDA/SCL), 7-bit addressing, pull-up requirements",
          "SPI: 4-wire high-speed bus (MOSI, MISO, SCK, CS), full-duplex transmission",
          "Debugging signal lines with a USB Logic Analyzer"
        ],
        "resources": [
          {
            "title": "SparkFun: Serial Communication Protocols Guide",
            "url": "https://learn.sparkfun.com/tutorials/serial-communication",
            "type": "Guide"
          }
        ],
        "challenge": "Connect an I2C OLED display and an SPI flash memory chip to the same microcontroller, displaying live sensor data on the screen."
      },
      {
        "id": "iot-mqtt",
        "stage": 3,
        "stageTitle": "Phase 3: Wireless Networking & Cloud IoT",
        "title": "MQTT Protocol & IoT Cloud",
        "type": "recommended",
        "description": "Connect microcontrollers to the internet to publish telemetry data and receive remote commands over MQTT/HTTP.",
        "whyLearn": "The defining feature of IoT is connecting physical objects to cloud backends and smart applications.",
        "subtopics": [
          "Connecting ESP32 to Wi-Fi with automatic reconnect logic",
          "MQTT protocol: Brokers (Mosquitto/HiveMQ), Topics, and QoS levels (0, 1, 2)",
          "JSON payload serialization and deserialization (ArduinoJson)",
          "Connecting to Cloud IoT platforms (AWS IoT Core / ThingsBoard)",
          "Deep Sleep modes for multi-year battery sensor operation"
        ],
        "resources": [
          {
            "title": "HiveMQ MQTT Essentials (Free)",
            "url": "https://www.hivemq.com/mqtt-essentials/",
            "type": "Guide"
          }
        ],
        "challenge": "Deploy an ESP32 weather station that publishes temperature and humidity JSON payloads every 60 seconds to an MQTT broker and sleeps in between."
      }
    ]
  },
  "robotics": {
    "title": "Robotics & Autonomous Systems Engineer",
    "description": "Step by step guide to becoming a Robotics and Autonomous Navigation Engineer in 2026",
    "nodes": [
      {
        "id": "rob-cpp-python",
        "stage": 1,
        "stageTitle": "Phase 1: Robotics Programming & Math",
        "title": "C++ & Python for Robotics",
        "type": "recommended",
        "description": "C++ is used for high-performance real-time motor control and vision; Python is used for rapid prototyping, simulation, and high-level logic.",
        "whyLearn": "Robotics software architectures combine both: heavy math runs in C++, orchestrated by Python scripts.",
        "subtopics": [
          "Modern C++ (C++17/20): pointers, references, smart pointers, STL containers",
          "Object-oriented design for robot actuators and sensors",
          "Python bindings and NumPy array transformations",
          "Real-time thread safety and concurrency basics"
        ],
        "resources": [
          {
            "title": "learncpp.com: Free Online C++ Tutorial",
            "url": "https://www.learncpp.com/",
            "type": "Tutorial"
          }
        ],
        "challenge": "Write a C++ class that models a 2-wheel differential drive robot, calculating linear and angular velocity from left and right wheel RPM."
      },
      {
        "id": "rob-math-kinematics",
        "stage": 1,
        "stageTitle": "Phase 1: Robotics Programming & Math",
        "title": "Robot Kinematics & Coordinate Frames",
        "type": "recommended",
        "description": "The spatial mathematics of rigid body motion: coordinate transformations, rotation matrices, quaternions, and forward kinematics.",
        "whyLearn": "Robots exist in 3D physical space; every sensor reading and motor movement must be transformed between coordinate reference frames.",
        "subtopics": [
          "Cartesian coordinates, Euler angles (roll, pitch, yaw) and Gimbal Lock",
          "Quaternions for smooth 3D rotations without singularities",
          "Homogeneous transformation matrices (4x4 rotation + translation)",
          "Forward Kinematics: computing end-effector position from joint angles",
          "Inverse Kinematics: computing joint angles to reach a target point"
        ],
        "resources": [
          {
            "title": "Modern Robotics by Kevin Lynch (Free Textbook & Videos)",
            "url": "http://modernrobotics.org/",
            "type": "Open Textbook & Video"
          }
        ],
        "challenge": "Write a Python script using homogeneous transformation matrices that computes the hand position of a 3-joint robotic arm."
      },
      {
        "id": "rob-pid-control",
        "stage": 2,
        "stageTitle": "Phase 2: Control Systems & Actuation",
        "title": "PID Feedback Control",
        "type": "recommended",
        "description": "The fundamental closed-loop algorithm that smoothly steers mobile robots, stabilizes drones, and positions robotic arms.",
        "whyLearn": "Without feedback control, robots drift, crash, and oscillate wildly due to physical friction and inertia.",
        "subtopics": [
          "Open-loop vs closed-loop feedback control",
          "Proportional term (P): reacting to present error",
          "Integral term (I): eliminating steady-state past drift",
          "Derivative term (D): dampening future overshoot",
          "Tuning PID constants manually and using Ziegler-Nichols method"
        ],
        "resources": [
          {
            "title": "Brian Douglas: Classical Control Theory Videos",
            "url": "https://www.youtube.com/user/ControlLectures",
            "type": "Video Series"
          }
        ],
        "challenge": "Simulate a line-following robot or drone altitude controller in Python, showing how tuning Kp, Ki, and Kd achieves fast convergence without overshoot."
      },
      {
        "id": "rob-ros2",
        "stage": 3,
        "stageTitle": "Phase 3: Robot Operating System (ROS 2)",
        "title": "ROS 2 Middleware & Simulation",
        "type": "recommended",
        "description": "The industry-standard robotics middleware providing publish/subscribe messaging, hardware drivers, and simulation tooling.",
        "whyLearn": "Universal framework used in warehouse robots, self-driving cars, industrial manipulators, and humanoid robotics.",
        "subtopics": [
          "ROS 2 architecture: Nodes, Topics, Services, Actions, and Parameters",
          "Writing custom publishers and subscribers in C++ and Python",
          "Coordinate transforms with tf2 (/world, /base_link, /camera_link)",
          "Simulating physical robot dynamics in Gazebo / Ignition",
          "Visualizing sensors, point clouds, and robot models in RViz 2"
        ],
        "resources": [
          {
            "title": "ROS 2 Official Documentation & Tutorials (Jazzy / Humble)",
            "url": "https://docs.ros.org/en/humble/Tutorials.html",
            "type": "Documentation"
          },
          {
            "title": "Articulated Robotics (Free YouTube Series)",
            "url": "https://www.youtube.com/@ArticulatedRobotics",
            "type": "Video Series"
          }
        ],
        "challenge": "Create a ROS 2 workspace, build a differential drive robot URDF model, launch it inside Gazebo simulation, and control its motion via cmd_vel in RViz."
      },
      {
        "id": "rob-slam-nav",
        "stage": 4,
        "stageTitle": "Phase 4: Autonomous Navigation & Perception",
        "title": "SLAM & Nav2 Autonomous Navigation",
        "type": "recommended",
        "description": "Autonomous navigation: building a map of an unknown room with LiDAR, localizing the robot within it, and planning collision-free routes.",
        "whyLearn": "The core autonomy stack powering robotic vacuums, warehouse AGVs, and self-driving delivery robots.",
        "subtopics": [
          "2D/3D LiDAR distance sensing and point clouds",
          "Occupancy Grid Maps (black=obstacle, white=free, gray=unknown)",
          "SLAM algorithms (Cartographer / Slam Toolbox)",
          "Global Path Planning (A* / Dijkstra) and Local Planners (DWB / TEB)",
          "Configuring the ROS 2 Nav2 navigation stack"
        ],
        "resources": [
          {
            "title": "Nav2 (ROS 2 Navigation Stack) Documentation",
            "url": "https://nav2.org/",
            "type": "Documentation"
          }
        ],
        "challenge": "Drive your simulated robot around a virtual room in Gazebo to generate a 2D map with SLAM Toolbox, then command it to navigate autonomously to a goal."
      }
    ]
  },
  "vlsi": {
    "title": "VLSI & Digital Chip Design Engineer",
    "description": "Step by step guide to becoming a VLSI, ASIC, and Digital Microchip Design Engineer in 2026",
    "nodes": [
      {
        "id": "vlsi-digital-logic",
        "stage": 1,
        "stageTitle": "Phase 1: Digital Logic & Hardware Description",
        "title": "Digital Logic & Boolean Algebra",
        "type": "recommended",
        "description": "The mathematical foundation of all digital computers: Boolean algebra, truth tables, logic gates, and Karnaugh maps.",
        "whyLearn": "Every computer chip (from a tiny smartwatch to an NVIDIA H100 GPU) is built from these core logic elements.",
        "subtopics": [
          "Boolean algebra theorems (De Morgan's Laws, duality)",
          "Basic logic gates: AND, OR, NOT, NAND, NOR, XOR, XNOR",
          "Combinational building blocks: Adders, Multiplexers, Decoders, Encoders",
          "Sequential elements: Latches, D Flip-Flops, T Flip-Flops, Registers",
          "Finite State Machines: Mealy vs Moore state models"
        ],
        "resources": [
          {
            "title": "All About Circuits: Digital Electronics",
            "url": "https://www.allaboutcircuits.com/textbook/digital/",
            "type": "Open Textbook"
          }
        ],
        "challenge": "Design a 4-bit synchronous binary up/down counter with reset using logic gates and D flip-flops, writing its complete truth table."
      },
      {
        "id": "vlsi-verilog",
        "stage": 1,
        "stageTitle": "Phase 1: Digital Logic & Hardware Description",
        "title": "Verilog / SystemVerilog HDL",
        "type": "recommended",
        "description": "The primary hardware description languages used worldwide to model, simulate, and design digital microchips.",
        "whyLearn": "Chip designers write text code that compilers synthesize directly into physical silicon transistors.",
        "subtopics": [
          "Module definitions, ports (input, output, inout), and wires vs regs",
          "Continuous assignments (assign) vs procedural blocks (always @)",
          "Blocking (=) vs non-blocking (<=) assignment rules for sequential logic",
          "Writing testbenches with initial blocks, delays (#), and assertions",
          "Simulating waveforms in Icarus Verilog and GTKWave"
        ],
        "resources": [
          {
            "title": "Asic World: Verilog Tutorial",
            "url": "https://www.asic-world.com/verilog/veritut.html",
            "type": "Tutorial"
          },
          {
            "title": "HDLBits: Interactive Verilog Practice Problems",
            "url": "https://hdlbits.01xz.net/wiki/Main_Page",
            "type": "Interactive"
          }
        ],
        "challenge": "Write a parameterized FIFO buffer in Verilog with full/empty flags, and simulate its read/write timing waveform cleanly in GTKWave."
      },
      {
        "id": "vlsi-fpga",
        "stage": 2,
        "stageTitle": "Phase 2: FPGA Prototyping & Architecture",
        "title": "FPGA Prototyping (Vivado)",
        "type": "recommended",
        "description": "Deploy and test digital hardware designs on physical reconfigurable FPGA chips before committing to multi-million-dollar ASIC silicon.",
        "whyLearn": "FPGAs allow instant hardware testing on real silicon at your desk with zero manufacturing turnaround time.",
        "subtopics": [
          "FPGA architecture: Look-Up Tables (LUTs), Flip-Flops, DSP Slices, Block RAM",
          "AMD Xilinx Vivado / Intel Quartus design suite workflow",
          "Pin constraints file (XDC constraints) mapping Verilog ports to FPGA pins",
          "Clock management with Phase-Locked Loops (PLLs)",
          "Deploying bitstreams to physical FPGA development boards"
        ],
        "resources": [
          {
            "title": "Nandland: FPGA and Verilog Tutorials",
            "url": "https://nandland.com/",
            "type": "Tutorials & Hardware"
          }
        ],
        "challenge": "Synthesize a digital stopwatch or UART serial receiver in Vivado and program it onto an FPGA development board, displaying seconds on a 7-segment display."
      },
      {
        "id": "vlsi-sta",
        "stage": 3,
        "stageTitle": "Phase 3: ASIC Design Flow & Timing Closure",
        "title": "Static Timing Analysis (STA)",
        "type": "recommended",
        "description": "Verify that electrical signals propagate through combinational gates and wires quickly enough to meet clock setup and hold deadlines.",
        "whyLearn": "If a chip fails Static Timing Analysis, it will produce corrupted data or freeze when manufactured on silicon.",
        "subtopics": [
          "Setup time and Hold time violations at clock edges",
          "Clock period, frequency, and clock jitter / skew",
          "Calculating timing Slack (Slack = Required Time - Arrival Time)",
          "Critical path identification and combinational delay reduction",
          "Using Synopsys PrimeTime or OpenSTA for timing reports"
        ],
        "resources": [
          {
            "title": "Static Timing Analysis for Nanometer Designs (J. Bhasker)",
            "url": "https://link.springer.com/book/10.1007/978-0-387-93820-2",
            "type": "Reference Book"
          }
        ],
        "challenge": "Analyze a timing report from OpenSTA on a pipelined multiplier, identify the critical path with negative slack, and insert pipeline registers to fix it."
      },
      {
        "id": "vlsi-physical",
        "stage": 4,
        "stageTitle": "Phase 4: Physical Design & Tapeout",
        "title": "ASIC Physical Design (RTL to GDSII)",
        "type": "recommended",
        "description": "The physical implementation flow: Floorplanning, Placement, Clock Tree Synthesis (CTS), Routing, and Design Rule Checking (DRC).",
        "whyLearn": "Transforms the abstract logic gates into nanometer geometric polygons etched into actual silicon microchips.",
        "subtopics": [
          "RTL Synthesis: mapping Verilog to foundry Standard Cells",
          "Floorplanning: chip boundary, I/O pads, and power grid mesh (VDD/VSS)",
          "Placement of millions of standard cells and wire length optimization",
          "Clock Tree Synthesis (CTS) to balance clock arrival skew",
          "DRC (Design Rule Check) and LVS (Layout vs Schematic) verification"
        ],
        "resources": [
          {
            "title": "OpenLane: Automated Open-Source ASIC Flow",
            "url": "https://openlane.readthedocs.io/",
            "type": "Open Source Tool"
          }
        ],
        "challenge": "Run an open-source RISC-V core through the OpenLane ASIC flow to generate clean, verified GDSII silicon layout polygons ready for tapeout."
      }
    ]
  },
  "networking": {
    "title": "Network Systems Engineer & Infrastructure Architect",
    "description": "Step by step guide to becoming a Network Systems Engineer, Infrastructure Architect, and Network Reliability Engineer in 2026",
    "nodes": [
      {
        "id": "net-osi-tcp",
        "stage": 1,
        "stageTitle": "Phase 1: Networking & Protocol Foundations",
        "title": "OSI & TCP/IP Model Foundations",
        "type": "recommended",
        "description": "The universal architectural blueprints of computer networking, packet encapsulation, and layered communication.",
        "whyLearn": "Every network packet, switch frame, and cloud connection relies on these 7 architectural layers.",
        "subtopics": [
          "OSI 7 layers vs TCP/IP 4-layer model",
          "Data encapsulation & decapsulation (Data -> Segment -> Packet -> Frame -> Bits)",
          "Ethernet framing, MAC addresses, and ARP (Address Resolution Protocol)",
          "IPv4 & IPv6 packet headers and Time-to-Live (TTL)",
          "Layer 4 ports (well-known ports: 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS)"
        ],
        "resources": [
          {
            "title": "Professor Messer's Network+ Course (Free)",
            "url": "https://www.professormesser.com/",
            "type": "Video Course"
          },
          {
            "title": "NetworkChuck: YouTube Networking Playlist",
            "url": "https://www.youtube.com/c/NetworkChuck",
            "type": "Video Series"
          }
        ],
        "challenge": "Use Wireshark to capture packet encapsulation in action, tracing how an HTTP request is wrapped into a TCP segment, IP packet, and Ethernet frame."
      },
      {
        "id": "net-subnetting",
        "stage": 1,
        "stageTitle": "Phase 1: Networking & Protocol Foundations",
        "title": "IPv4 Subnetting & CIDR Notation",
        "type": "recommended",
        "description": "Master binary subnet masks, network IDs, broadcast addresses, and Classless Inter-Domain Routing (CIDR).",
        "whyLearn": "Subnetting is the mathematical language of IP network design, tested in every technical networking interview.",
        "subtopics": [
          "Binary conversion of IPv4 octets (powers of 2)",
          "Subnet masks (/24, /28, /30) and calculating usable host counts (2^n - 2)",
          "Finding Network Address, First Host, Last Host, and Broadcast Address",
          "Variable Length Subnet Masking (VLSM) for efficient IP allocation",
          "Private IP ranges (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)"
        ],
        "resources": [
          {
            "title": "subnetting.net: Interactive Subnetting Drills",
            "url": "https://www.subnetting.net/",
            "type": "Practice Drills"
          }
        ],
        "challenge": "Take a 192.168.10.0/24 address block and divide it using VLSM into 4 distinct subnets for Sales (50 hosts), Engineering (100 hosts), and Management (20 hosts)."
      },
      {
        "id": "net-switching",
        "stage": 2,
        "stageTitle": "Phase 2: Enterprise Switching & Routing",
        "title": "Enterprise Switching & VLANs",
        "type": "recommended",
        "description": "Configure Layer 2 enterprise switches, segment networks with Virtual LANs (VLANs), and prevent loops with Spanning Tree Protocol (STP).",
        "whyLearn": "Switches are the core plumbing of office buildings, campuses, and cloud datacenters.",
        "subtopics": [
          "Switch MAC address learning table (CAM table) and frame forwarding",
          "Creating and assigning access ports to VLANs (802.1Q tagging)",
          "Trunk ports for carrying multiple VLANs between switches",
          "Spanning Tree Protocol (STP / RSTP) to prevent broadcast storm loops",
          "Inter-VLAN routing using a Router-on-a-Stick or Layer 3 Switch"
        ],
        "resources": [
          {
            "title": "Cisco Packet Tracer (Free Simulator)",
            "url": "https://www.netacad.com/courses/packet-tracer",
            "type": "Free Simulator"
          }
        ],
        "challenge": "Build a network topology in Cisco Packet Tracer with 2 switches, configure VLAN 10 (Staff) and VLAN 20 (Guests), and test Inter-VLAN routing isolation."
      },
      {
        "id": "net-routing",
        "stage": 2,
        "stageTitle": "Phase 2: Enterprise Switching & Routing",
        "title": "Dynamic Routing (OSPF & BGP)",
        "type": "recommended",
        "description": "Configure dynamic routing protocols that automatically calculate optimal paths and route packets around broken links.",
        "whyLearn": "OSPF powers internal enterprise and campus networks; BGP is the global routing protocol that holds the entire internet together.",
        "subtopics": [
          "Static routing vs dynamic routing protocols",
          "Distance Vector (RIP) vs Link-State (OSPF) routing algorithms",
          "OSPF: Single-area and multi-area OSPF, Link-State Advertisements (LSAs)",
          "Border Gateway Protocol (BGP): Autonomous Systems (ASNs) and path vector routing",
          "Route redistribution and metric cost calculations"
        ],
        "resources": [
          {
            "title": "NetworkLessons.com: OSPF & BGP Guides",
            "url": "https://networklessons.com/",
            "type": "Tutorials"
          }
        ],
        "challenge": "Configure a 3-router network in Packet Tracer running OSPF Area 0, verify dynamic route convergence, and simulate a link failure to observe auto-rerouting."
      },
      {
        "id": "net-security-infra",
        "stage": 3,
        "stageTitle": "Phase 3: Network Security & Automation",
        "title": "Firewalls, ACLs & Network Security",
        "type": "recommended",
        "description": "Secure network boundaries using Access Control Lists (ACLs), Next-Generation Firewalls, and encrypted VPN tunnels.",
        "whyLearn": "Network engineers are responsible for defending corporate perimeters against unauthorized external access.",
        "subtopics": [
          "Standard and Extended Access Control Lists (ACLs)",
          "Stateful firewall packet inspection vs stateless packet filtering",
          "Network Address Translation (NAT) and Port Address Translation (PAT)",
          "Site-to-Site IPsec VPNs and Remote Access VPNs (WireGuard / OpenVPN)",
          "Network hardening: disabling Telnet, enforcing SSHv2, securing console ports"
        ],
        "resources": [
          {
            "title": "Fortinet / Palo Alto Free Security Fundamentals",
            "url": "https://www.paloaltonetworks.com/",
            "type": "Reference Guide"
          }
        ],
        "challenge": "Configure an Extended ACL on a Cisco router that allows web traffic (HTTP/HTTPS) from a subnet but strictly blocks all SSH and Telnet attempts."
      },
      {
        "id": "net-automation",
        "stage": 4,
        "stageTitle": "Phase 4: Network Automation & Cloud",
        "title": "Network Automation (Python & Ansible)",
        "type": "recommended",
        "description": "Automate configuration changes across hundreds of routers and switches using Python scripts, Netmiko, and Ansible playbooks.",
        "whyLearn": "Modern network engineering has evolved from manual command typing to Infrastructure-as-Code automation.",
        "subtopics": [
          "Python for Network Engineers (Netmiko, Paramiko, Scrapli)",
          "Ansible playbooks for automated switch configuration backups",
          "Structured data: JSON, YAML, and XML",
          "RESTCONF and NETCONF programmatic network APIs",
          "Version-controlling network configurations with Git"
        ],
        "resources": [
          {
            "title": "Kirk Byers: Python for Network Engineers (Free Email Course)",
            "url": "https://pynet.twb-tech.com/",
            "type": "Free Course"
          }
        ],
        "challenge": "Write a Python script using Netmiko that connects via SSH to 3 switches simultaneously, backs up their running configurations, and saves them to timestamped files."
      }
    ]
  }
};

export default ROADMAP_SH_DOMAINS;