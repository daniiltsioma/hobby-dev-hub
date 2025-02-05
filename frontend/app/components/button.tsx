"use client";

interface ButtonProps {
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, ...props }) => {
    return (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
