import { PermissionName } from '@modules/user/domain/enums/permission-name';
import { PermissionParameterType } from '@modules/user/domain/enums/permission-parameter-type';
import { PermissionParameterValue } from '@modules/user/domain/enums/permission-parameter-value';

const AllParameter = {
    type: PermissionParameterType.STRING,
    value: PermissionParameterValue.ALL,
    description: 'Hamısı',
};

export const DefaultPermissionNames = [PermissionName.CUSTOMERS_WIEW, PermissionName.FAQS_VIEW];

const PermissionsData = [
    {
        name: PermissionName.DASHBOARD_WIEW,
        description: 'Admin sehifesinə baxmaq',
    },

    // CUSTOMER
    {
        name: PermissionName.CUSTOMERS_WIEW,
        description: 'Müştərilərə baxmaq',
        parameters: [],
    },

    {
        name: PermissionName.CUSTOMERS_CREATE,
        description: 'Müştəri yaratmaq',
    },

    {
        name: PermissionName.CUSTOMERS_UPDATE,
        description: 'Müştəri redaktə etmək',
    },

    {
        name: PermissionName.CUSTOMERS_DELETE,
        description: 'Müştəri silmək',
    },

    // DOCTOR
    {
        name: PermissionName.DOCTORS_WIEW,
        description: 'Həkimlərə baxmaq',
        parameters: [],
    },

    {
        name: PermissionName.DOCTORS_CREATE,
        description: 'Həkim yaratmaq',
    },

    {
        name: PermissionName.DOCTORS_UPDATE,
        description: 'Həkim redaktə etmək',
    },

    {
        name: PermissionName.DOCTORS_DELETE,
        description: 'Həkim silmək',
    },

    // REPORT ACTIONS
    {
        name: PermissionName.REPORTS_VIEW,
        description: 'Hesabatalara baxmaq',
    },

    {
        name: PermissionName.REPORTS_CREATE,
        description: 'Hesabat yaratmaq',
    },

    {
        name: PermissionName.REPORTS_UPDATE,
        description: 'Hesabat redaktə etmək',
    },

    {
        name: PermissionName.REPORTS_DELETE,
        description: 'Hesabat silmək',
    },

    //  COMMON SETTING
    {
        name: PermissionName.COMMON_SETTINGS_VIEW,
        description: 'Ümumi parametrlərə baxmaq',
    },

    {
        name: PermissionName.COMMON_SETTINGS_CREATE,
        description: 'Ümumi parametr yaratmaq',
    },

    {
        name: PermissionName.COMMON_SETTINGS_UPDATE,
        description: 'Ümumi parametr redaktə etmək',
    },

    {
        name: PermissionName.COMMON_SETTINGS_DELETE,
        description: 'Ümumi parametr silmək',
    },

    // EMAIL NOTIFICATION
    {
        name: PermissionName.EMAIL_NOTIFICATIONS_VIEW,
        description: 'E-poçt bildirişilərinə baxmaq',
    },

    {
        name: PermissionName.EMAIL_NOTIFICATIONS_CREATE,
        description: 'E-poçt bildirişi yaratmaq',
    },

    {
        name: PermissionName.EMAIL_NOTIFICATIONS_UPDATE,
        description: 'E-poçt bildirişi redaktə etmək',
    },

    {
        name: PermissionName.EMAIL_NOTIFICATIONS_DELETE,
        description: 'E-poçt bildirişi silmək',
    },

    // SMS NOTIFICATION
    {
        name: PermissionName.SMS_NOTIFICATIONS_VIEW,
        description: 'SMS  bildirişilərinə baxmaq',
    },

    {
        name: PermissionName.SMS_NOTIFICATIONS_CREATE,
        description: 'SMS bildirişi yaratmaq',
    },

    {
        name: PermissionName.SMS_NOTIFICATIONS_UPDATE,
        description: 'SMS bildirişi redaktə etmək',
    },

    {
        name: PermissionName.SMS_NOTIFICATIONS_DELETE,
        description: 'SMS bildirişi silmək',
    },

    // SERVICE
    {
        name: PermissionName.SERVICES_VIEW,
        description: 'Xidmətlərə baxmaq',
    },

    {
        name: PermissionName.SERVICES_CREATE,
        description: 'Xidmət yaratmaq',
    },

    {
        name: PermissionName.SERVICES_UPDATE,
        description: 'Xidmət redaktə etmək',
    },

    {
        name: PermissionName.SERVICES_DELETE,
        description: 'Xidmət silmək',
    },

    // FAQS
    {
        name: PermissionName.FAQS_VIEW,
        description: 'Tez-tez verilən suallara baxmaq',
    },

    {
        name: PermissionName.FAQS_CREATE,
        description: 'Tez-tez verilən sual yaratmaq',
    },

    {
        name: PermissionName.FAQS_UPDATE,
        description: 'Tez-tez verilən sual redaktə etmək',
    },

    {
        name: PermissionName.FAQS_DELETE,
        description: 'Tez-tez verilən sual silmək',
    },

    //  HOME_PAGE
    {
        name: PermissionName.HOME_PAGE_VIEW,
        description: 'Əsas səhifələrə baxmaq',
    },

    {
        name: PermissionName.HOME_PAGE_UPDATE,
        description: 'Əsas səhifə redaktə etmək',
    },

    // TERMS AND CONDITIONS
    {
        name: PermissionName.TERMS_AND_CONDITIONS_VIEW,
        description: 'Gizlilik Siyasətilərinə baxmaq',
    },

    {
        name: PermissionName.TERMS_AND_CONDITIONS_UPDATE,
        description: 'SMS bildirişi redaktə etmək',
    },

    // ABOUT US
    {
        name: PermissionName.ABOUT_US_VIEW,
        description: 'Haqqımızda səhifəsinə baxmaq',
    },

    {
        name: PermissionName.ABOUT_US_UPDATE,
        description: 'Haqqımızda səhifəsini redaktə etmək',
    },

    // USERS
    {
        name: PermissionName.USERS_VIEW,
        description: 'İstifadəçilərə baxmaq',
    },

    {
        name: PermissionName.USERS_CREATE,
        description: 'İstifadəçi yaratmaq',
    },

    {
        name: PermissionName.USERS_UPDATE,
        description: 'İstifadəçi redaktə etmək',
    },

    {
        name: PermissionName.USERS_DELETE,
        description: 'İstifadəçi silmək',
    },
];

export function getPermissionsData(): any {
    return PermissionsData.map(({ parameters, ...pd }) => {
        let newParameters = [];

        if (parameters) {
            newParameters = [...parameters, AllParameter];
        } else {
            newParameters = [AllParameter];
        }
        return { ...pd, parameters: newParameters };
    });
}
