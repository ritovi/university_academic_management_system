import  type { Request } from "express";
import { universityConfig } from "../../config/university.config.js";

export enum ClassMode {
    IN_PERSON = "in_person",
    REMOTE = "remote",
    HYBRID = "hybrid"
}

export class IPService {
    private readonly universityIPRanges: string[] = universityConfig.universityIPRanges;
    private readonly universityIPs: string[] = universityConfig.universityIPs;


    extractIPAddress(req: Request): string {
        const forwardedFor = req.headers['x-forwarded-for'];
        if (forwardedFor) {
            const ips = (forwardedFor as string).split(',');
            return ips[0]!.trim(); //===============================================================================
        }

        const realIP = req.headers['x-real-ip'];
        if (realIP) {
            return realIP as string;
        }

 
        const remoteAddress = req.socket.remoteAddress || 'unknown';
        

        if (remoteAddress === '::1' || remoteAddress === '::ffff:127.0.0.1') {
            return '127.0.0.1';
        }
        
       
        if (remoteAddress.startsWith('::ffff:')) {
            return remoteAddress.substring(7);
        }

        return remoteAddress;
    }



    isUniversityIP(ipAddress: string): boolean {
       
        if (ipAddress === 'unknown')  return false;
        

        if (this.universityIPs.includes(ipAddress)) {
            return true;
        }

        for (const range of this.universityIPRanges) {
            if (this.isIPInRange(ipAddress, range)) {
                return true;
            }
        }

        return false;
    }


    determineClassMode(ipAddress: string): ClassMode {
        const isUniversity = this.isUniversityIP(ipAddress);
        
        if (isUniversity) {
            return ClassMode.IN_PERSON;
        } else {
            return ClassMode.REMOTE;
        }
    }

    private isIPInRange(ip: string, range: string): boolean {
    
        
        if (!range.includes('/')) {
            return ip === range;
        }

        try {
            const [rangeIP, prefixLength] = range.split('/');
            const ipNum = this.ipToNumber(ip);
            const rangeNum = this.ipToNumber(rangeIP!);  //=======================================================================================
            const mask = -1 << (32 - parseInt(prefixLength!));  //=========================================================================
            
            return (ipNum & mask) === (rangeNum & mask);
        } catch (error) {
            return false;
        }
    }

    
    //IPv4 only
    private ipToNumber(ip: string): number {
        const parts = ip.split('.');
        if (parts.length !== 4) {
            throw new Error('Invalid IPv4 address');
        }
        
        return parts.reduce((acc, part, index) => {
            return acc + (parseInt(part) << (24 - (index * 8)));
        }, 0);
    }

    getClassModeDescription(mode: ClassMode): string {
        switch (mode) {
            case ClassMode.IN_PERSON:
                return "In-Person Class (University Network)";
            case ClassMode.REMOTE:
                return "Remote Class (External Network)";
            case ClassMode.HYBRID:
                return "Hybrid Class";
            default:
                return "Unknown";
        }
    }

    
    canMarkAttendance(classMode: ClassMode, classType: 'theory' | 'lab'): boolean {
        const { enforceInPersonForTheory, enforceInPersonForLab, allowRemoteAttendance } = universityConfig.policies;

        if (!allowRemoteAttendance && classMode === ClassMode.REMOTE) {
            return false;
        }

        if (classType === 'theory' && enforceInPersonForTheory && classMode === ClassMode.REMOTE) {
            return false;
        }

        if (classType === 'lab' && enforceInPersonForLab && classMode === ClassMode.REMOTE) {
            return false;
        }

        // Allowing by default :v
        return true;
    }
}