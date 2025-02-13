export const getUser = async () => {
    const user = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/user`)
        .then((res) => res.json())
        .catch(() => null);
    return user;
};

export const logout = async () => {
    await fetch(`${import.meta.env.VITE_EXPRESS_URL}/logout`)
        .then((res) => res.text())
        .then((message) => {
            console.log(message);
        });
};
