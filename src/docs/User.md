## Save User

**URL** : `api/v1/user`

**Method** : `POST`

**Header** : `application/json`

**Auth required** : None

**Permissions required** : None

## Request Body
```json
{
    "name": "Nitesh",
    "email": "nitesh.nituk14@gmail.com",
    "phone_number": "1234567890",
    "class": 12,
    "address": "Noida"
}
```

## Response
```json
{
    "code": 201,
    "status": "CREATED",
    "message": "Successfully Created.",
    "data": {
        "_id": "5eb2e783fd6f543074952e3d",
        "name": "Nitesh",
        "email": "nitesh.nituk14@gmail.com",
        "phone_number": "1234567890",
        "class": 12,
        "address": "Noida",
        "created_at": "2020-05-06T16:36:19.000Z",
        "updated_at": "2020-05-06T16:36:19.000Z"
    },
    "resource": "user",
    "resource_url": "localhost:8083/api/v1/user",
    "total": 1
}
````



## Get User

**URL** : `api/v1/user`

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
            "_id": "5eb1ab5e903e2501bcfcbbcd",
            "address": "Noida",
            "class": 10,
            "created_at": "2020-05-05T18:09:43.000Z",
            "email": "nitesh.nituk14@gmail.com",
            "name": "Nitesh",
            "phone_number": "1234567890",
            "updated_at": "2020-05-05T18:10:33.000Z"
        }
    ],
    "resource": "user",
    "resource_url": "localhost:8083/api/v1/user",
    "total": 1
}
````



## Update User

**URL** : `api/v1/user/:_id`

**Method** : `PATCH`

**Auth required** : None

**Permissions required** : None

## Body
```json
{
    "class": 5
}
````

## Response
```json
{
    "code": 200,
    "status": "SUCCESS",
    "message": "Updated Successfully.",
    "data": {
        "_id": "5eb1ab5e903e2501bcfcbbcd",
        "address": "Noida",
        "class": 5,
        "created_at": "2020-05-05T18:09:43.000Z",
        "email": "nitesh.nituk14@gmail.com",
        "name": "Nitesh",
        "phone_number": "1234567890",
        "updated_at": "2020-05-06T16:44:29.000Z"
    },
    "resource": "user",
    "resource_url": "localhost:8083/api/v1/user/5eb1ab5e903e2501bcfcbbcd",
    "total": 1
}
````
