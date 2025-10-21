const AccessHR = (auth: any): boolean => {
    return auth && (auth.role === 'HR' || auth.role === 'DHR' || auth.role === 'CEO');
}

const AccessDHR = (auth: any): boolean => {
    return auth && (auth.role === 'DHR' || auth.role === 'CEO');
}

const AccessCEO = (auth: any): boolean => {
    return auth && auth.role === 'CEO';
}



const Access = (auth: any, role: string): boolean => {
    console.log(auth.role)
    switch (role) {
        case 'HR':
            return AccessHR(auth)
            break;
        case 'DHR':
            return AccessDHR(auth)
            break;
        case 'CEO':
            return AccessCEO(auth)
            break;
        default:
            return false
            break;
    }
}


export default Access;