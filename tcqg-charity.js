// Javascript functions used by the Tri-County Quilt Guild's Charity Quilt Management System

// --------------------------------------------------------------------------------------------------------------------
// Local Storage for Member ID

const localStorageKey = "TCQG-Charity Member ID";

function storeMemberId(memberId) {
    localStorage.setItem ( localStorageKey, memberId );
}

function getStoredMemberId() {
    return localStorage.getItem(localStorageKey);
}

function clearStoredMemberId() {
    localStorage.removeItem(localStorageKey);
}

// --------------------------------------------------------------------------------------------------------------------
// Get Query Parameters From the URL

const param_memberId = "memberId";
const param_quiltId = "quiltId";

function getParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function getMemberIdParameter() {
    return getParameter(param_memberId);
}

function getQuiltIdParameter() {
    return getParameter(param_quiltId);
}

// --------------------------------------------------------------------------------------------------------------------
// Fetch Members or Quilts From the Server

const url_members = "./members.json";
//const url_members = 'https://raw.githubusercontent.com/tcqg-charity-dev/tcqg-charity-dev/main/members.json?junk=1';
const url_quilts  = "./quilts.json";
//const url_quilts = 'https://raw.githubusercontent.com/tcqg-charity-dev/tcqg-charity-dev/main/quilts.json?junk=1';


async function fetchJsonFile(url) {
    try {
        // Get the file.
        const response = await fetch(url);
        if ( response.ok == false ) {
            throw new Error(`Fetch failed - status=${response.status}`);
        }

        // Read the response as text.
        const rsp = await response.text();

        // Parse the response body as JSON and return the resulting object.
        let data;
        try {
            data = JSON.parse(rsp);
        } catch (parse_error) {
            console.error('Response is not JSON:',rsp.slice(0,200));
            throw new Error('Response is not valid JSON.');
        }
        return data;

    } catch (error) {
        console.error(`Failed to fetch JSON file ${url}:`, error.message);
        return null; // Calling code will need to decide how to show the error to the user.
    }
}

async function fetchJsonArray(url) {
    let data = await fetchJsonFile(url);
    if ( data != null ) {
        if ( Array.isArray(data) == false ) {
            console.error(`JSON file ${url} is not an Array.`);
            return null;
        }
    }
    return data;
}

async function fetchJsonObject(url) {
    let data = await fetchJsonFile(url);
    if ( data != null ) {
        if ( typeof data !== 'object' ) {
            console.error(`JSON file ${url} returned a non-object value.`);
            return null;
        }
        if ( Array.isArray(data) == true ) {
            console.error(`JSON file ${url} is an Array, not a single object.`);
            return null;
        }
    }
    return data;
}

function fetchMembers() {
    return fetchJsonArray(url_members);
}

function fetchQuilts(quiltId) {
    // Note: quiltId is optional. If defined, we only apply updates for the specified quilt, and we return that quilt's
    //       object instead of returning the whole array of quilt objects.

    let quilts = fetchJsonArray(url_quilts);

    //TODO - apply updates

    return quilts;
}
