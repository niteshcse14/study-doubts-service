## Download Related Questions PDF

**URL** : `api/v1/download/pdf`

**Method** : `POST`

**Header** : `application/json`

**Auth required** : None

**Permissions required** : None

## Request Body
```json
{
    "question": "Find the measure of each exterior angle of a regular polygon of(i) 9 sides (ii) 15 sides",
    "user_id": "5eb1ab5e903e2501bcfcbbcd"
}
```

## Response
```json
{
    "code": 200,
    "status": "SUCCESS",
    "data": {
        "message": "Task has been scheduled. Please check your email after 5 minute for more related questions."
    },
    "resource": "pdf",
    "resource_url": "localhost:8083/api/v1/download/pdf",
    "total": 1
}
````
