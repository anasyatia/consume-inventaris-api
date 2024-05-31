export default function Title({ name, page, lang }) {
    return (
        <>
        <h1 className="text-white">Name: {name}</h1>
        <p className="text-white">Page: {page}</p>
        <p className="text-white">Lang: {lang}</p>
        </>
    )
}