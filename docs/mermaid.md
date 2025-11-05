graph TB
  subgraph Users
    AU[Authenticated User<br/>Creates & manages quizzes]
    GU[Guest User<br/>Takes quizzes anonymously]
    AD[Administrator<br/>Manages system<br/><i>Optional/Future</i>]
  end
  
  WF[Web Frontend<br/>React SPA]
  
  QA[Quiz Application<br/>Go API with JWT auth]
  
  DB[(PostgreSQL<br/>Database)]
  
  AU -->|HTTPS| WF
  GU -->|HTTPS| WF
  AD -->|HTTPS| WF
  
  WF -->|REST/JSON + JWT| QA
  QA -->|SQL| DB
  
  style Users fill:#89b4fa,stroke:#89b4fa,color:#1e1e2e
  style WF fill:#6c7086,stroke:#6c7086,color:#cdd6f4
  style QA fill:#89dceb,stroke:#89dceb,color:#1e1e2e
  style DB fill:#585b70,stroke:#585b70,color:#cdd6f4