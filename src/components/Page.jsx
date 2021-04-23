const Page = (props) => {
    return(
        <section className={`page --full-width --full-height --flex --${props.column ? 'column' : 'row'} --centralize-vert`}>
            {props.children}
        </section>
    );
};

export default Page;