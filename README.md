# 🔥 Burn-on-Read Service

An app that automatically deletes messages after they have been viewed once. Perfect for sharing sensitive information that should not persist after reading.

## 🌟 Features

- **One-Time Reading**: Messages are permanently deleted after being viewed once
- **Secure Input Sanitization**: All user input is sanitized to prevent XSS attacks
- **Unique Link Generation**: Each message gets a unique UUID-based URL
- **Modern UI**: Clean, responsive design using PICO.CSS framework
- **Auto-Cleanup**: No manual cleanup required - files self-destruct
- **Copy-to-Clipboard**: Easy link sharing functionality
- **Comprehensive Logging**: All requests are logged for monitoring

## 🚀 How It Works

1. **Create Message**: User enters a message (up to 2000 characters)
2. **Generate Link**: System creates a unique, shareable URL
3. **Share Securely**: Send the link to the intended recipient
4. **View & Burn**: Once opened, the message is displayed and immediately deleted
5. **Link Expires**: Subsequent visits show "Message Not Found"

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js and TypeScript
- **Templates**: Nunjucks for server-side rendering
- **Styling**: PICO.CSS framework with custom enhancements
- **Security**: Input sanitization with validator.js
- **File System**: Temporary file storage with automatic cleanup

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd burn-on-read
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env file if needed
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm run build
npm start
```

The server will be available at `http://localhost:3000` (or the port specified in your environment).

## 📁 Project Structure

```
burn-on-read/
├── src/
│   ├── app.ts                    # Main Express application
│   ├── middlewares/
│   │   └── loggerMiddleware.ts   # Request logging middleware
│   ├── services/
│   │   └── burnMessageUtils.ts   # Core burn message functionality
│   └── templates/
│       ├── _baseLayout.html      # Base template with PICO.CSS
│       ├── create.html           # Message creation form
│       ├── success.html          # Success page with shareable link
│       ├── message.html          # Message display page
│       └── notFound.html         # 404 page for expired messages
├── static/
│   └── css/
│       └── styles.css            # Custom CSS enhancements
├── burn-messages/                # Temporary message storage (auto-created)
├── logs/                         # Application logs (auto-created)
└── dist/                         # Compiled TypeScript (auto-created)
```

## 🛡️ Security Features

### Input Sanitization

- HTML entities are escaped to prevent XSS attacks
- Whitespace is normalized for consistent storage
- Maximum message length enforced (2000 characters)

### UUID Validation

- Message IDs are validated against UUID v4 format
- Prevents path traversal attacks
- Regex validation: `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`

### File System Security

- Messages stored outside web root
- Automatic directory creation with proper permissions
- Immediate file deletion after reading

## 🔗 API Endpoints

| Method | Endpoint       | Description                        |
| ------ | -------------- | ---------------------------------- |
| `GET`  | `/`            | Redirects to message creation form |
| `GET`  | `/create`      | Display message creation form      |
| `POST` | `/create`      | Create new burn message            |
| `GET`  | `/message/:id` | View and burn message              |

## 💾 Environment Variables

```env
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
```

## 🎨 Customization

### Styling

- Modify `static/css/styles.css` for custom styling
- PICO.CSS variables can be overridden
- Dark mode support included

### Message Limits

- Change maximum message length in `src/app.ts`
- Modify validation rules in `burnMessageUtils.ts`

### Security Settings

- Adjust sanitization rules in `sanitizeInput()` function
- Configure CORS settings in `src/app.ts`

## 📊 Logging

All HTTP requests are automatically logged with:

- Timestamp (ISO format)
- HTTP method
- Client IP address
- Request URL

Logs are stored in `logs/logs.txt` and automatically created if missing.

## 🚨 Error Handling

- **Empty Messages**: Returns validation error
- **Message Too Long**: Returns length validation error
- **Invalid UUID**: Returns 404 Not Found
- **Missing Files**: Returns 404 Not Found
- **Server Errors**: Returns 500 with generic error message

## 🔒 Security Considerations

⚠️ **Important Security Notes:**

1. **HTTPS Recommended**: Use HTTPS in production to encrypt link transmission
2. **Link Security**: Anyone with the link can read the message
3. **No Recovery**: Deleted messages cannot be recovered
4. **Temporary Storage**: Messages exist as files until viewed
5. **Server Logs**: Request URLs (including message IDs) are logged

## 🧪 Testing

### Manual Testing

1. Navigate to `http://localhost:3000`
2. Create a test message
3. Copy the generated link
4. Open link in new browser tab/window
5. Verify message displays and subsequent visits fail

### Automated Testing

```bash
# Example using curl
curl -X POST http://localhost:3000/create \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "message=Test burn message"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

---

**⚠️ Remember: Once a message is burned, it's gone forever!** 🔥
