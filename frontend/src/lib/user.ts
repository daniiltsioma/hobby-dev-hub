export const getUser = async () => {
    const user = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/user`).then(
        (res) => res.json()
    );
    return user;
};
