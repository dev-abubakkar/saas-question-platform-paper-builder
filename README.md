# Microfrontend Application with pnpm

A modern microfrontend architecture using React, TypeScript, and Webpack Module Federation, managed with pnpm.

## 🏗️ Architecture

- **Host Application**: `apps/host-app` (Port 3000) - React-based host application
- **Question Builder**: `apps/question-builder` (Port 3001) - Question management microfrontend
- **Paper Builder**: `apps/paper-builder` (Port 3002) - Paper creation microfrontend  
- **Admin Panel**: `apps/admin-panel` (Port 3003) - Administration microfrontend

## 🛠️ Tech Stack

### Core Technologies
- **Package Manager**: pnpm
- **Framework**: React 18 with TypeScript
- **Build Tool**: Webpack 5 with Module Federation
- **Styling**: Tailwind CSS

### Shared Dependencies
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **State Management**: Redux Toolkit + Zustand
- **HTTP Client**: Axios + Fetch API
- **Utilities**: clsx/classnames
- **Icons**: React Icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (install with `npm install -g pnpm`)

### Installation

1. **Install all dependencies:**
\`\`\`bash
pnpm run install:all
\`\`\`

2. **Start all applications:**
\`\`\`bash
pnpm run dev
\`\`\`

3. **Access applications:**
- Host Application: http://localhost:3000
- Question Builder: http://localhost:3001
- Paper Builder: http://localhost:3002
- Admin Panel: http://localhost:3003

### Individual Commands

\`\`\`bash
# Start individual applications
pnpm run dev:host
pnpm run dev:question-builder
pnpm run dev:paper-builder
pnpm run dev:admin-panel

# Build for production
pnpm run build

# Type checking
cd apps/host-app && pnpm run type-check
\`\`\`

## 📁 Project Structure

\`\`\`
frontend/
├── apps/
│   ├── host-app/                 # Host application (React)
│   ├── question-builder/         # Question management MFE
│   ├── paper-builder/           # Paper creation MFE
│   └── admin-panel/             # Administration MFE
├── libs/                        # Shared libraries (future)
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── package.json                # Root package.json
\`\`\`

## 🔧 Key Features

### Host Application
- **Module Federation Host**: Dynamically loads remote microfrontends
- **Shared Layout**: Consistent navigation and styling
- **State Management**: Redux Toolkit for global state
- **Routing**: React Router with lazy loading
- **Form Validation**: React Hook Form + Zod schemas

### Microfrontends
- **Independent Development**: Each MFE can be developed separately
- **Shared Dependencies**: React, React-DOM, and utilities shared as singletons
- **Type Safety**: Full TypeScript support across all modules
- **Consistent Styling**: Shared Tailwind CSS configuration

## 🔄 Development Workflow

1. **Start Development**: `pnpm run dev` starts all applications
2. **Independent Development**: Each MFE can be developed separately
3. **Hot Reloading**: All applications support hot reloading
4. **Type Checking**: TypeScript validation across all modules
5. **Shared Dependencies**: Consistent versions across all MFEs

## 📦 Package Management

Using pnpm for:
- **Workspace Management**: Efficient monorepo handling
- **Dependency Deduplication**: Shared dependencies across MFEs
- **Fast Installs**: Faster than npm/yarn
- **Disk Space Efficiency**: Symlinked node_modules

## 🚀 Deployment

Each microfrontend can be deployed independently:

\`\`\`bash
# Build all applications
pnpm run build

# Build individual applications
cd apps/host-app && pnpm run build
cd apps/question-builder && pnpm run build
\`\`\`

## 🤝 Contributing

1. Install dependencies: `pnpm run install:all`
2. Start development: `pnpm run dev`
3. Make changes to individual MFEs
4. Test integration in host application
5. Build and deploy independently

## 📝 Notes

- All applications use the same tech stack for consistency
- Shared dependencies are configured as singletons in Module Federation
- Each MFE maintains its own package.json and dependencies
- pnpm workspace ensures efficient dependency management

=================================================================================

This Microfrontend Project Structure 
------------------------------------
pnpm-workspace/
├── apps/
│   ├── host-app/           # React host application
│   ├── question-builder/   # React microfrontend
│   ├── paper-builder/      # React microfrontend
│   └── admin-panel/        # React microfrontend
├── libs/                   # Shared libraries (future)
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
├── README.md
├── .gitignore
├── nx.json                 # Optional
├── tailwind.config.js      # Optional shared config
└── tsconfig.json          # Optional shared config

Structure Summery:
------------------

| **Path**                          | **Description**                                                            |
| --------------------------------- | -------------------------------------------------------------------------- |
| `apps/`                           | Contains all React applications (host + microfrontends)                    |
| `apps/host-app/`                  | Main container app using Module Federation to load microfrontends          |
| `apps/question-builder/`          | Microfrontend for creating and managing questions                          |
| `apps/paper-builder/`             | Microfrontend for designing exam papers                                    |
| `apps/admin-panel/`               | Microfrontend for admin dashboard and tools                                |
| `libs/`                           | Shared libraries (UI components, hooks, types, etc.) for reuse across apps |
| `pnpm-workspace.yaml`             | Declares workspace packages (for monorepo with pnpm)                       |
| `package.json`                    | Root dependencies and scripts                                              |
| `pnpm-lock.yaml`                  | Ensures consistent dependency versions across environments                 |
| `README.md`                       | Project documentation or instructions                                      |
| `.gitignore`                      | Specifies files and folders to exclude from Git                            |
| `nx.json` *(optional)*            | Configuration for Nx (if using Nx for monorepo tools)                      |
| `tailwind.config.js` *(optional)* | Shared Tailwind CSS configuration across apps                              |
| `tsconfig.json` *(optional)*      | Shared TypeScript configuration across apps and libs                       |

Setup Process/Command:
-----------------------
1. npm install -g pnpm
2. pnpm install
3. pnpm run dev