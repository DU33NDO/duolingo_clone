# Private Chat Feature

## Overview

This is a person-to-person chat system that allows users to:

- See all registered users with their online/offline status
- Send private messages to any user
- View chat history with each user
- Real-time status updates

## Features Implemented

### 1. **User Online Status Tracking**

- Users are automatically set to "online" when they log in
- Status is updated to "offline" when they log out
- Last seen timestamp is tracked
- Real-time status updates every 5 seconds

### 2. **Message Storage**

- All messages are stored in MongoDB
- Messages include sender, receiver, content, and timestamps
- Read status tracking for messages
- Chronological message ordering

### 3. **Chat Interface**

- **Left Panel**: List of all users with online/offline status
- **Right Panel**: Chat conversation with selected user
- Green dot indicator for online users
- "Last seen" timestamp for offline users
- Auto-scroll to latest messages

### 4. **API Routes**

#### `/api/users` (GET)

- Fetches all users except the current user
- Returns username, email, avatar, online status, and last seen
- Sorted by online status first

#### `/api/messages` (GET)

- Fetches all messages between two users
- Query parameter: `userId` (the other user's ID)
- Automatically marks messages as read

#### `/api/messages` (POST)

- Sends a new message
- Body: `{ receiverId, content }`
- Returns the created message

#### `/api/users/status` (POST)

- Updates user's online status
- Body: `{ isOnline: boolean }`
- Updates lastSeen timestamp

## Database Models

### **User Model** (`models/User.ts`)

```typescript
{
  username: string
  email: string
  password: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}
```

### **Message Model** (`models/Message.ts`)

```typescript
{
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## How It Works

1. **Login/Register**: User status is set to online
2. **Chat Page** (`/chat`):
   - Loads all users from database
   - Polls for user status updates every 5 seconds
   - When a user is selected, loads message history
   - Polls for new messages every 2 seconds
3. **Sending Messages**:
   - Messages are saved to database via API
   - UI updates immediately
   - Other user sees message on next poll
4. **Logout**: User status is set to offline

## Usage

1. Register or login to the app
2. Navigate to `/chat` page
3. Click on any user from the left panel
4. Start chatting!

## Future Enhancements (Optional)

- WebSocket integration for true real-time messaging
- Typing indicators
- Message delivery/read receipts
- File/image sharing
- Group chats
- Push notifications
- Emoji support
- Search messages
- Delete messages
- Block users

## Notes

- Currently uses polling (every 2-5 seconds) instead of WebSockets for simplicity
- All messages are stored permanently in the database
- Online status is updated on login, logout, and page close
- MongoDB must be running for chat to work
