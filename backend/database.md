```mermaid
erDiagram
    USER {
        string user_id
        string username
        string email
    }
    DATASET {
        string dataset_id
        string name
        string description
        string user_id
    }
    MODEL {
        string model_id
        string name
        string description
        string dataset_id
    }
    ANALYSIS {
        string analysis_id
        string name
        string description
        string dataset_id
    }
    USER ||--o{ DATASET : owns
    DATASET ||--|{ MODEL : contains
    DATASET ||--|{ ANALYSIS : includes
