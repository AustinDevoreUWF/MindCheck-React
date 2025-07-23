
export default function Sidebar(){
    return(
<div className ="sidebar">
        <h2>Menu</h2>
        <button onClick={onToggleTheme}>Toggle Dark/Light</button>
        <button onClick={onRefresh}>Refresh Graph</button>
        <Link /*Here is the link to the about page*//>
</div>


    );

}