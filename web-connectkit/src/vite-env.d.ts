/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_REACT_APP_PROJECT_ID: string
    readonly VITE_REACT_APP_PROJECT_ID: string
    readonly VITE_REACT_APP_CONTRACT_ADDRESS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}