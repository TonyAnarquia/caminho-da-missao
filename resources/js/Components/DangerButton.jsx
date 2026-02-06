export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `ui-button-danger ${disabled ? 'opacity-50' : ''} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
