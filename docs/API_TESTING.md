# 🧪 API Testing Guide – StudyFlow

This guide provides instructions for manually testing all REST API endpoints in the StudyFlow application.

> **Note:** StudyFlow uses in-memory storage. All data is lost when the server restarts. Start fresh each session.

---

## Base URL

```
http://localhost:3000/api
```

---

## Endpoint Reference

| Method | Endpoint | Description | Success Code |
|--------|----------|-------------|-------------|
| `GET` | `/api/tasks` | Get all tasks | 200 |
| `GET` | `/api/tasks/:id` | Get single task | 200 |
| `POST` | `/api/tasks` | Create a task | 201 |
| `PUT` | `/api/tasks/:id` | Update a task | 200 |
| `DELETE` | `/api/tasks/:id` | Delete a task | 200 |
| `PATCH` | `/api/tasks/:id/status` | Toggle completion | 200 |

---

## Testing with cURL

### 1. Create a Task (POST)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Jane Doe",
    "email": "jane@example.com",
    "taskTitle": "Math Assignment Chapter 5",
    "subject": "Mathematics",
    "description": "Complete all exercises from chapter 5 of the textbook",
    "deadline": "2026-12-15",
    "priority": "High",
    "category": "Assignment",
    "estimatedHours": 3,
    "confirmation": true
  }'
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "studentName": "Jane Doe",
    "email": "jane@example.com",
    "taskTitle": "Math Assignment Chapter 5",
    "subject": "Mathematics",
    "description": "Complete all exercises from chapter 5 of the textbook",
    "deadline": "2026-12-15",
    "priority": "High",
    "category": "Assignment",
    "estimatedHours": 3,
    "completed": false,
    "createdAt": "2026-08-24T..."
  }
}
```

### 2. Create a Second Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Jane Doe",
    "email": "jane@example.com",
    "taskTitle": "History Essay",
    "subject": "History",
    "description": "Write a 500-word essay on the Industrial Revolution",
    "deadline": "2026-12-20",
    "priority": "Medium",
    "category": "Project",
    "estimatedHours": 5,
    "confirmation": true
  }'
```

### 3. Get All Tasks (GET)

```bash
curl http://localhost:3000/api/tasks
```

**Expected:** Array of all created tasks.

### 4. Get All Tasks with Query Parameters

```bash
# Search
curl "http://localhost:3000/api/tasks?search=math"

# Filter by priority
curl "http://localhost:3000/api/tasks?priority=high"

# Filter by status
curl "http://localhost:3000/api/tasks?status=pending"

# Sort by title
curl "http://localhost:3000/api/tasks?sort=titleAsc"

# Combined
curl "http://localhost:3000/api/tasks?priority=high&sort=oldest"
```

### 5. Get Single Task (GET)

```bash
curl http://localhost:3000/api/tasks/1
```

**Expected (200 OK):**

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": { "id": 1, ... }
}
```

### 6. Get Non-Existent Task

```bash
curl http://localhost:3000/api/tasks/999
```

**Expected (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

### 7. Update a Task (PUT)

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Jane Doe",
    "email": "jane@example.com",
    "taskTitle": "Math Assignment Chapter 5 - Revised",
    "subject": "Mathematics",
    "description": "Complete exercises 1-20 from chapter 5 of the textbook",
    "deadline": "2026-12-18",
    "priority": "Medium",
    "category": "Assignment",
    "estimatedHours": 4,
    "confirmation": true
  }'
```

**Expected (200 OK):** Updated task data.

### 8. Toggle Task Status (PATCH)

```bash
# Mark as completed
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Mark as pending
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"completed": false}'
```

### 9. Delete a Task (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/tasks/2
```

**Expected (200 OK):**

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {}
}
```

---

## Error Testing

### Invalid Request Body (POST)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "",
    "email": "not-an-email",
    "taskTitle": "ab"
  }'
```

**Expected (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "studentName": "Name cannot be empty or only spaces.",
    "email": "Please enter a valid email address.",
    "taskTitle": "Task title must contain 3–80 characters.",
    "subject": "Subject cannot be empty.",
    "description": "Description cannot be whitespace only.",
    "deadline": "Deadline is required.",
    "priority": "Please select a valid priority.",
    "category": "Please select a valid category.",
    "estimatedHours": "Estimated study hours are required.",
    "confirmation": "You must confirm that the information is correct."
  }
}
```

### Invalid JSON Payload

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```

**Expected (400 Bad Request):**

```json
{
  "success": false,
  "message": "Invalid JSON payload format"
}
```

### Unknown API Route

```bash
curl http://localhost:3000/api/nonexistent
```

**Expected (404 Not Found):**

```json
{
  "success": false,
  "message": "API Route Not Found"
}
```

### Invalid Status Update (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"completed": "yes"}'
```

**Expected (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "completed": "completed status must be a boolean"
  }
}
```

---

## Testing with Browser

1. Open `http://localhost:3000/api/tasks` in a browser to see the JSON response
2. Use the browser's Network tab in Developer Tools to inspect API calls made by the frontend
3. Visit `http://localhost:3000/api-docs` for interactive documentation

---

## Testing with Postman (Optional)

1. Import the base URL: `http://localhost:3000/api`
2. Set `Content-Type: application/json` header for POST/PUT/PATCH requests
3. Use the request bodies from the examples above
4. Verify response status codes and JSON structure
