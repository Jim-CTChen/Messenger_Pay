const requirement = {
  user: { // /api/user
    GET: {
      '/': ['username'],
    },
    POST: {
      '/': ['username', 'password', 'name'],
      '/login': ['username', 'password'],
    }
  },
  event: { // /api/event
    GET: {
      '/friend': ['username', 'friendName'],
      '/all': ['username']
    },
    POST: {
      '/': ['creditor', 'debtor', 'amount', 'type']
    },
    PUT: {
      '/': ['username', 'eventId']
    }
  },
  group: {
    GET: {
      '/': ['username', 'groupId']
    },
    POST: {
      '/': ['groupName', 'usernames'],
      '/addUser': ['groupId', 'usernames'],
      '/removeUser': ['groupId', 'usernames']
    }
  }
}

export default requirement