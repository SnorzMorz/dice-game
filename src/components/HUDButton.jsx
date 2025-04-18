//////////////////////// src/components/HUDButton.jsx ////////////////////////
export default function HUDButton({ children, ...props }) {
    return (
        <button className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-40" {...props}>
            {children}
        </button>
    );
}