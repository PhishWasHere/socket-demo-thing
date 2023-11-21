const getError = (err: unknown): string => { // func to return err as string
    let msg;

    if (err instanceof Error) {
        msg = err.message;
    } else if (err && typeof err === 'object' && 'message' in err) {
        msg = String(err.message);
    } else if (typeof err === 'string') {
        msg = err;
    } msg = 'Unknown error';

    console.error(`\x1b[31m> Server error: \x1b[0m`, msg);
    console.error(`\x1b[33m> Stack: \x1b[0m`, err);
    
    return msg;
};

export default getError;