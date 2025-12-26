# PackView Web - AI Coding Guidelines

## Project Overview
PackView is a React-based web application built with modern tooling for package management visualization. The app uses TypeScript for type safety and follows React best practices.

## Tech Stack & Architecture
- **Frontend**: React 19 with functional components and hooks
- **Build Tool**: Vite 7 for fast development and optimized production builds
- **Styling**: Tailwind CSS 4 for utility-first CSS
- **State Management**: Zustand 5 for lightweight global state
- **Data Fetching**: TanStack React Query 5 + Axios for API calls and caching
- **Language**: TypeScript 5.9 with strict mode enabled
- **Linting**: ESLint with React-specific rules (hooks, refresh)

## Key Files & Structure
- `src/main.tsx`: App entry point with React 18+ createRoot
- `src/App.tsx`: Main app component (currently template code)
- `vite.config.ts`: Minimal Vite config with React plugin
- `tsconfig.app.json`: Strict TypeScript config for app code
- `eslint.config.js`: Flat config with React hooks and refresh plugins

## Development Workflows
- **Start dev server**: `npm run dev` (Vite with HMR)
- **Build for production**: `npm run build` (TypeScript compilation + Vite build)
- **Lint code**: `npm run lint` (ESLint on all files)
- **Preview build**: `npm run preview` (Serve built files locally)

## Coding Patterns & Conventions
- Use functional components with hooks (no class components)
- Leverage Zustand stores for shared state (create stores in `src/stores/`)
- Use React Query for server state management (queries in `src/queries/`, mutations in `src/mutations/`)
- Axios instances configured in `src/api/` for consistent API calls
- Tailwind classes directly in JSX for styling
- TypeScript interfaces/types defined alongside components or in `src/types/`
- Error boundaries and loading states for async operations

## Component Structure Example
```tsx
// src/components/PackageList.tsx
import { useQuery } from '@tanstack/react-query'
import { usePackageStore } from '../stores/packageStore'

export function PackageList() {
  const { selectedPackage, setSelectedPackage } = usePackageStore()
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.getPackages()
  })

  if (isLoading) return <div>Loading packages...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {packages?.map(pkg => (
        <div key={pkg.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{pkg.name}</h3>
          <button 
            onClick={() => setSelectedPackage(pkg)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  )
}
```

## State Management Pattern
```tsx
// src/stores/packageStore.ts
import { create } from 'zustand'

interface Package {
  id: string
  name: string
  version: string
}

interface PackageState {
  packages: Package[]
  selectedPackage: Package | null
  setPackages: (packages: Package[]) => void
  setSelectedPackage: (pkg: Package | null) => void
}

export const usePackageStore = create<PackageState>((set) => ({
  packages: [],
  selectedPackage: null,
  setPackages: (packages) => set({ packages }),
  setSelectedPackage: (selectedPackage) => set({ selectedPackage })
}))
```

## API Integration Pattern
```tsx
// src/api/packages.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

export const packageApi = {
  getPackages: () => api.get('/packages').then(res => res.data),
  getPackage: (id: string) => api.get(`/packages/${id}`).then(res => res.data),
  createPackage: (data: CreatePackageData) => api.post('/packages', data).then(res => res.data)
}
```

## Notes
- The app currently shows template content in Portuguese - replace with actual PackView functionality
- Environment variables prefixed with `VITE_` are exposed to client code
- Composite TypeScript config separates app and Node.js tooling configs
- ESLint ignores `dist/` directory automatically</content>
<parameter name="filePath">/Users/dara/dev/packview-web/.github/copilot-instructions.md