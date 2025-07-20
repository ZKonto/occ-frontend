function sanitize(response) {

    // c/cpp sanitization

    let {compilerOp, execOp} = response;
    let sanCompilerOp = compilerOp;
    // let compOpLines = compilerOp === undefined ? [] : compilerOp.split("\n");

    // if(lang === 'c' || lang === 'c++') {
    //     sanCompilerOp = compOpLines.map(line => {
    //         return line.replaceAll(/^.*.c: */gi, '');  
    //     }).join("\n");    
    // }
    // else if(lang === 'python') {
    //     sanCompilerOp = compOpLines.map(line => {
    //         return line.replaceAll(/.*\.py\S*/gi, '')
    //     }).join("\n");
    // }
    
    return {sanCompilerOp, execOp};
}

export default sanitize;