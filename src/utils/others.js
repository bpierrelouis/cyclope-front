export const preventDefault = (fn) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    fn(event);
};
