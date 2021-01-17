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
<<<<<<< HEAD
      '/addUser': ['groupId', 'usernames'],
      '/removeUser': ['groupId', 'usernames']
=======
      '/addUser': ['groupId', 'usernames']
>>>>>>> de193121e19dc4fb21748cd049342237c038432c
    }
  }
}

export default requirement