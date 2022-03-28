
function Header( { start } ) {
    console.log(start);
    return (
        <button onClick={start}>Start a new attempt</button>
    )
}

export default Header;