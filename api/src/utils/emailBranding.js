const logoBlock = `
<div style="text-align: center; margin-bottom: 12px; line-height: 1;">
    <div style="margin-bottom: 8px;">
        <img src="https://qreivldoesiymawwzhvn.supabase.co/storage/v1/object/public/LOGO/logo.png" alt="Amend Landscaping" style="width: 80px; height: auto; display: inline-block;" />
    </div>
    <span style="color: #166534; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; vertical-align: middle;">
        Amend
    </span>
    <span style="color: #111827; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; vertical-align: middle;">
        Landscaping
    </span>
</div>
`;

// Helper component for making the headers highly consistent
const generateHeader = (subtitle, borderColor, subtitleColor, bgColor) => `
<div style="background-color: ${bgColor}; padding: 40px 20px 30px; text-align: center; border-bottom: 4px solid ${borderColor}; border-radius: 12px 12px 0 0;">
    ${logoBlock}
    <p style="color: ${subtitleColor}; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 12px 0 0 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
        ${subtitle}
    </p>
</div>
`;

const bookingHeader = generateHeader(
    'Service Request Received',
    '#16a34a', // border (green-600)
    '#15803d', // subtitle (green-700)
    '#fafafa'  // bg (neutral-50)
);

const approvalHeader = generateHeader(
    'Appointment Approved ✓',
    '#16a34a', // border (green-600)
    '#15803d', // subtitle (green-700)
    '#f0fdf4'  // bg (green-50)
);

const cancellationHeader = generateHeader(
    'Appointment Update',
    '#dc2626', // border (red-600)
    '#b91c1c', // subtitle (red-700)
    '#fef2f2'  // bg (red-50)
);

// Standard Footer mirroring frontend footer 
const standardFooter = `
<div style="background-color: #fafafa; padding: 40px 20px; text-align: center; border-top: 1px solid #f3f4f6; border-radius: 0 0 12px 12px; margin-top: 40px;">
    
    <!-- Matching the frontend custom divider underline -->
    <div style="width: 64px; height: 3px; background-color: #bbf7d0; margin: 0 auto 24px auto; border-radius: 4px;"></div>

    <p style="color: #6b7280; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; font-weight: 500;">
        Need assistance or have questions? <br>
        Call us at <a href="tel:2607156959" style="color: #16a34a; text-decoration: none; font-weight: 700;">(260) 715-6959</a><br>
        Email <a href="mailto:amendlandscaping@gmail.com" style="color: #16a34a; text-decoration: none; font-weight: 700;">amendlandscaping@gmail.com</a><br>
        Visit us online at <a href="https://amendlandscapingllc.com/" style="color: #16a34a; text-decoration: none; font-weight: 700;">amendlandscapingllc.com</a>
    </p>
    <p style="color: #9ca3af; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
        &copy; ${new Date().getFullYear()} Amend Landscaping. All rights reserved.
    </p>
</div>
`;

module.exports = {
    bookingHeader,
    approvalHeader,
    cancellationHeader,
    standardFooter,
};
