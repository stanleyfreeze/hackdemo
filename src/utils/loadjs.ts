const loadJS = (path:string) => {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = path
        document.documentElement.appendChild(s);
        s.onload = (e) => { resolve(e)}
        s.onerror = (e,m) => { reject({e, m})}
    });
}
export default loadJS