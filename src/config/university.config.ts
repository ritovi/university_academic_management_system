
export const universityConfig = {
    universityIPs: [ "127.0.0.1"],

    universityIPRanges: [],   //IP Ranges in CIDR notation :v

   
    policies: {
       
        enforceInPersonForTheory: false,  
        enforceInPersonForLab: false,   
        
      
        allowRemoteAttendance: true,      
       
        logIPAddresses: true,
    }
};