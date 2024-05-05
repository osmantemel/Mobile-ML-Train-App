flowchart LR
    subgraph Kullanıcı
    A[Kullanıcı] -->|Veri Seti Yükleme İsteği| B[Veri Seti Oluşturma]
    end
    subgraph Veri İşleme
    B -->|Veri Seti Oluşturuldu| C[Veri Seti İşleme]
    C -->|Veri İşlendi| D[Model Oluşturma]
    end
    subgraph Modelleme
    D -->|Model Oluşturuldu| E[Model Eğitimi]
    end
    subgraph Analiz
    E -->|Model Eğitildi| F[Analiz Yapma]
    end
    subgraph Sonuçlar
    F -->|Analiz Tamamlandı| G[Sonuçları İnceleme]
    G -->|Sonuçlar İncelendi| H[Projeyi Değerlendirme]
    end

    style A fill:#f9fafe,stroke:#28a745,stroke-width:2px,stroke-dasharray: 5, 5, stroke-opacity:0.5,stroke-linecap:round;
    style B,C,D,E,F,G fill:#f0fff0,stroke:#999,stroke-width:2px,stroke-dasharray: 5, 5, stroke-opacity:0.5,stroke-linecap:round;
    style H fill:#e6ffff,stroke:#4285f4,stroke-width:2px,stroke-dasharray: 5, 5, stroke-opacity:0.5,stroke-linecap:round;
