## User Asked Questions

**URL** : `api/v1/asked-questions`

**Method** : `GET`

**Auth required** : None

**Permissions required** : None

## Response
```json
{
    "code": 200,
    "status": "SUCCESS",
    "message": "Successfully.",
    "data": [
        {
            "_id": "5eb2eea9f77761605063534b",
            "user_id": "5eb1ab5e903e2501bcfcbbcd",
            "question": "Find the measure of each exterior angle of a regular polygon of(i) 9 sides (ii) 15 sides",
            "created_at": "2020-05-06T17:06:49.000Z",
            "updated_at": "2020-05-06T17:06:49.000Z"
        }
    ],
    "resource": "user_asked_question",
    "resource_url": "localhost:8083/api/v1/catalog-questions",
    "total": 5
}
````
