const swapChildren = (node1, node2) =>{
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;

    if(node1 === afterNode2){
        parent.insertBefore(node1, node2);
    }else{
        node1.replaceWith(node2);
        parent.insertBefore(node1, afterNode2);
    };
};

export default swapChildren;