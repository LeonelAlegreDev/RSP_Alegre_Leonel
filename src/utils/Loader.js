class Loader
{
    static Show(loader){
        document.getElementById(loader).style.display = "flex";
        document.body.style.overflowY = 'hidden';
    }

    static Hide(loader){
        document.getElementById(loader).style.display = "none";
        document.body.style.overflowY = "auto";
    }
}

export default Loader;