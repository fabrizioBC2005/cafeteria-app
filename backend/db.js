const users = [
  {
    id: 1,
    name: "Admin Locafe",
    email: "admin@locafe.com",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]

let nextUserId = 2

function incrementId() {
  return nextUserId++
}

module.exports = { users, incrementId }