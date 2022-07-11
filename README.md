<p align="center">
  <h1 align="center">
    Valex
  </h1>
</p>

## Usage

```bash
$ git clone https://github.com/LucasPerroni/valex.git

$ cd valex

$ npm install

$ npm run dev
```

API:

```
- POST /cards/creation
    - Rota para criar um novo card
    - headers: {
        "X-API-Key": "apiKey da empresa"
    }
    - body: {
        "employeeId": x,
        "type": "groceries || restaurant || transport || education || health"
    }
    
- PUT /cards/activate/:id
    - Rota para ativar um card
    - headers: {}
    - body: {
        "cvc": xxx,
        "password": "xxxx"
    }
    
- PUT /cards/block/:id
    - Rota para bloquear um card
    - headers: {}
    - body: {
        "password": "xxxx"
    }
    
- PUT /cards/unblock/:id
    - Rota para desbloquear um card
    - headers: {}
    - body: {
        "password": "xxxx"
    } 
    
- GET /cards/log/:id
    - Rota para ver as recargas e pagamentos de um card
    - headers: {}
    - body: {}  
    
- POST /cards
    - Rota para receber os dados de inumeros cards
    - headers: {}
    - body: {
        "employeeId": x,
        "cards": [{
            "number": "lorem ipsum",
            "expirationDate": "xx/xx",
            "password": "xxxx"
        }]
    }     
```

```
- POST /recharge/:id
    - Rota para recarregar um card
    - headers: {
        "X-API-Key": "apiKey da empresa"
    }
    - body: {
        "amount": x
    }
```

```
- POST /payment/:id
    - Rota para registrar um pagamento de um card
    - headers: {}
    - body: {
        "password": "xxxx",
        "businessId": x
        "amount": x
    }
```
