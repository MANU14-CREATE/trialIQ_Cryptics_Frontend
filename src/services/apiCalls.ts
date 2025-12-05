import { PATHS, API } from "./constant";


export function DASHBOARD_API(data: any, cb: any) {
  API.GENERAL(PATHS.DASHBOARD_API, "POST", data, {}, {}, (res: any) => {
    cb(res);
  });
}

export function LOGIN_USER_API(data: any, cb: any) {
  const headers = {
    // "Content-Type": "application/json",
    // withCredentials: true,
  };
  API.GENERAL(PATHS.USER_LOGIN_API, "POST", data, {}, headers, (res: any) => {
    cb(res);
  });

}
export function REGISTER_USER_API(data: any, cb: any) {
  API.GENERAL(PATHS.USER_REGISTER_API, "POST", data, {}, {}, (res: any) => {
    cb(res);
  });
}

export function USER_INFO_API(data: any, cb: any) {
  API.GET(PATHS.USER_ME_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function USER_LOGOUT_API(data: any, cb: any) {
  API.POST(PATHS.USER_LOGOUT_API, data, {}, (res: any) => {
    cb(res);
  });
}



export function SITES_API(data: any, cb: any) {
  API.GET(PATHS.SITES_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function PROVIDER_API(data: any, cb: any) {
  API.GET(PATHS.PROVIDERS_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function MODULES_API(data: any, cb: any) {
  API.GET(PATHS.MODULES_API, data, {}, (res: any) => {
    cb(res);
  });
}
// users 
export function USERS_API(data: any, cb: any) {
  API.GET(PATHS.USERS_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function CREATE_USERS_API(data: any, cb: any) {
  API.POST(PATHS.USERS_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function UPDATE_USERS_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.USER_BY_ID_API(id), data, {}, (res: any) => {
    cb(res);
  });
}
export function DELETE_USERS_API(id: any, cb: any) {
  API.DELETE(PATHS.USER_BY_ID_API(id), {}, (res: any) => {
    cb(res);
  });
}

// roles
export function ROLES_API(data: any, cb: any) {
  API.GET(PATHS.ROLES_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function CREATE_ROLES_API(data: any, cb: any) {
  API.POST(PATHS.ROLES_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function EDIT_ROLES_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.ROLE_BY_ID_API(id), data, {}, (res: any) => {
    cb(res);
  });
}
export function EDIT_ROLES_PERMISSIONS_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.ROLE_PERMISSIONS_API(id), data, {}, (res: any) => {
    cb(res);
  });
}
export function GET_ROLES_API(data: any, cb: any) {
  API.GET(PATHS.ROLE_BY_ID_API(data), data, {}, (res: any) => {
    cb(res);
  });
}
export function DELETE_ROLES_API(data: any, cb: any) {
  API.DELETE(PATHS.ROLE_BY_ID_API(data), {}, (res: any) => {
    cb(res);
  });
}


// organizations 
export function ORGANISATION_API(data: any, cb: any) {
  API.GET(PATHS.ORGANIZATIONS_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function GET_ORGANISATION_API(id: any, cb: any) {
  API.GET(PATHS.ORGANIZATION_BY_ID_API(id), {}, {}, (res: any) => {
    cb(res);
  });
}

export function CREATE_ORGANISATION_API(data: any, cb: any) {
  API.POST(PATHS.ORGANIZATIONS_API, data, {}, (res: any) => {
    cb(res);
  });
}

export function UPDATE_ORGANISATION_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.ORGANIZATION_BY_ID_API(id), data, {}, (res: any) => {
    cb(res);
  });
}
export function DELETE_ORGANISATION_API(id: any, cb: any) {
  API.DELETE(PATHS.ORGANIZATION_BY_ID_API(id), {}, (res: any) => {
    cb(res);
  });
}
export function GET_ORGANISATION_DOCUMENTS_API(orgId: any, cb: any) {
  API.GET(PATHS.ORGANIZATION_DOCUMENTS_BY_ID_API(orgId), {}, {}, (res: any) => {
    cb(res);
  });
} // get documents list

export function CREATE_ORGANISATION_DOCUMENTS_API(orgId: any, data: any, cb: any) {
  API.POST(PATHS.ORGANIZATION_DOCUMENTS_BY_ID_API(orgId), data, {}, (res: any) => {
    cb(res);
  });
}

export function GET_ORGANISATION_DOCUMENT_API(orgId: any, docId: any, cb: any) {
  API.GET(PATHS.ORGANIZATION_DOCUMENT_BY_ID_API(orgId, docId), {}, {}, (res: any) => {
    cb(res);
  });
} // get single document
export function UPDATE_ORGANISATION_DOCUMENT_API(orgId: any, data: any, cb: any) {
  API.PUT(PATHS.ORGANIZATION_DOCUMENTS_BY_ID_API(orgId), data, {}, (res: any) => {
    cb(res);
  });
} // update single document
export function DELETE_ORGANISATION_DOC_API(orgId: any, docId: any, cb: any) {
  API.DELETE(PATHS.ORGANIZATION_DOCUMENT_BY_ID_API(orgId, docId), {}, (res: any) => {
    cb(res);
  });
} // detete single document

export function DELETE_ORGANISATION_DOCUMENT_API(id: any, docId: any, cb: any) {
  API.DELETE(PATHS.ORGANIZATION_DOCUMENT_BY_ID_API(id, docId), {}, (res: any) => {
    cb(res);
  });
} //. delete single document



// trails api
export function TRIALS_API(cb: any) {
  API.GET(PATHS.TRIALS_API, {}, {}, (res: any) => {
    cb(res);
  });
}
export function GET_TRIAL_API(id: any, cb: any) {
  API.GET(PATHS.TRIALS_BY_ID_API(id), {}, {}, (res: any) => {
    cb(res);
  });
}
export function CREATE_TRIAL_API(data: any, cb: any) {
  API.POST(PATHS.TRIALS_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function UPDATE_TRIAL_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.TRIALS_BY_ID_API(id), data, {}, (res: any) => {
    cb(res);
  });
}

export function DELETE_TRIAL_API(id: any, cb: any) {
  API.DELETE(PATHS.TRIALS_BY_ID_API(id), {}, (res: any) => {
    cb(res);
  });
}

export function ASSIGN_SPONSOR_TO_TRIAL_API(id: any, data: any, cb: any) {
  API.POST(PATHS.ASSIGN_SPONSOR_TO_TRIALS(id), data, {}, (res: any) => {
    cb(res);
  });
}

export function ASSIGN_SITE_TO_TRIAL_API(id: any, data: any, cb: any) {
  API.POST(PATHS.ASSIGN_SITE_TO_TRIALS(id), data, {}, (res: any) => {
    cb(res);
  });
}

// sponsors
export function SPONSORS_API(data: any, cb: any) {
  API.GET(PATHS.SPONSORS_API, data, {}, (res: any) => {
    cb(res);
  });
}
export function SPONSOR_API(spoId: any, cb: any) {
  API.GET(PATHS.SPONSOR_BY_ID_API(spoId), {}, {}, (res: any) => {
    cb(res);
  });
}
export function CREATE_SPONSOR_API(data: any, cb: any) {
  API.POST(PATHS.SPONSORS_API, data, {}, (res: any) => {
    cb(res);
  });
}

export function UPDATE_SPONSOR_API(spoId: any, data: any, cb: any) {
  API.PUT(PATHS.SPONSOR_BY_ID_API(spoId), data, {}, (res: any) => {
    cb(res);
  });
}
export function DELETE_SPONSOR(spoId: any, cb: any) {
  API.DELETE(PATHS.SPONSOR_BY_ID_API(spoId), {}, (res: any) => {
    cb(res);
  });
}

export function CREATE_SPONSOR_DOC_API(spoId: any, data: any, cb: any) {
  API.POST(PATHS.SPONSOR_DOUMENTS_BY_ID_API(spoId), data, {}, (res: any) => {
    cb(res);
  });
}

export function SPONSOR_DOC_API(spoId: any, cb: any) {
  API.GET(PATHS.SPONSOR_DOUMENTS_BY_ID_API(spoId), {}, {}, (res: any) => {
    cb(res);
  });
}

export function SPONSOR_SINGLE_DOC_API(spoId: any, docId: any, cb: any) {
  API.GET(PATHS.SPONSOR_DOUMENT_BY_ID_API(spoId, docId), {}, {}, (res: any) => {
    cb(res);
  });
}

export function UPDATE_SPONSOR_SINGLE_DOC_API(spoId: any, docId: any, data: any, cb: any) {
  API.PUT(PATHS.SPONSOR_DOUMENT_BY_ID_API(spoId, docId), data, {}, (res: any) => {
    cb(res);
  });
}

export function DELETE_SPONSOR_SINGLE_DOC_API(spoId: any, docId: any, cb: any) {
  API.DELETE(PATHS.SPONSOR_DOUMENT_BY_ID_API(spoId, docId), {}, (res: any) => {
    cb(res);
  });
}


// sites 

export function CREATE_SITE_API(data: any, cb: any) {
  API.POST(PATHS.SITES_API, data, {}, (res: any) => {
    cb(res);
  });
}

export function UPDATE_SITE_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.SITE_BY_ID_API(id), data, {}, (res: any) => {
    cb(res);
  });
}

export function DELETE_SITE_API(id: any, cb: any) {
  API.DELETE(PATHS.SITE_BY_ID_API(id), {}, (res: any) => {
    cb(res);
  });
}

// providers

export function CREATE_PROVIDER_API(data: any, cb: any) {
  API.POST(PATHS.PROVIDERS_API, data, {}, (res: any) => {
    cb(res);
  });
}

export function UPDATE_PROVIDER_API(id: any, data: any, cb: any) {
  API.PUT(PATHS.PROVIDER_BY_ID_API(id), data, {}, (res: any) => {
    cb(res);
  });
}

export function DELETE_PROVIDER_API(id: any, cb: any) {
  API.DELETE(PATHS.PROVIDER_BY_ID_API(id), {}, (res: any) => {
    cb(res);
  });
}

// trials extra api
export function FETCH_TRIAL_DETAILS_API(data: any, cb: any) {
  API.GENERAL(PATHS.FETCH_TRIAL_DETAILS, "POST", data, {}, {
    accept: 'application/json',
    ContentType: 'application/json'
  }, (res: any) => {
    cb(res);
  })
}

export function EDIT_TRIAL_DETAILS_API(data: any, cb: any) {
  API.GENERAL(PATHS.EDIT_TRIAL_DETAILS, "POST", data, {}, {
    accept: 'application/json',
    ContentType: 'application/json'
  }, (res: any) => {
    cb(res);
  })
}



