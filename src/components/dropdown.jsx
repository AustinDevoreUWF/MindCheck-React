export default function DropdownMenus(props){
    return (
    <div id='drop-menu'>
        <label htmlFor={props.type}>Select a {props.type}</label>
        <select id={props.type} name={props.type}>
            {props.options.map((thing, index)=>
                <option key={index} value={thing}>{thing}</option>
            )}
        </select>
</div>
    );
}