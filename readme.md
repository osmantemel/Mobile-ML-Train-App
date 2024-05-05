```mermaid
graph TD
    subgraph Kullanıcı
    A[Kullanıcı] -->|Veri Seti Yükleme İsteği| B[İstemci Tarafı]
    end
    subgraph İstemci
    B[İstemci Tarafı] -->|HTTP İsteği| C[Flask Sunucusu]
    C[Flask Sunucusu] -->|Veri Seti İsteği| B[İstemci Tarafı]
    end
    subgraph Sunucu
    C[Flask Sunucusu] -->|SQLite Veritabanı İşlemleri| D[SQLite Veritabanı]
    end
    subgraph Eğitim
    D[SQLite Veritabanı] -->|Veri İşleme ve Model Eğitimi| E[Makine Öğrenimi Modeli]
    end
    subgraph Analiz
    E[Makine Öğrenimi Modeli] -->|Tahminler ve Analiz| F[Analiz Sonuçları]
    end
    subgraph İstemci
    F[Analiz Sonuçları] -->|HTTP Yanıtı| G[Kullanıcı]
    end

    style A,B,G fill:#f9fafe,stroke:#28a745,stroke-width:2px,stroke-dasharray: 5, 5;
    style C,D,E fill:#f0fff0,stroke:#999,stroke-width:2px,stroke-dasharray: 5, 5;
    style F fill:#e6ffff,stroke:#4285f4,stroke-width:2px,stroke-dasharray: 5, 5;
    style B,G arrow-end: open;
    style C,D,E arrow-end: open;
