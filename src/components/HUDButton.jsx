export default function HUDButton({ children, ...props }) {
    return (
        <button
            className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-40 active:scale-95 active:bg-indigo-700 transition-transform"
            {...props}
        >
            {children}
        </button>
    );
}