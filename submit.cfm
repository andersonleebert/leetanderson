<cfset Variables.output.message = "Thank you. Your message was sent." />
<cfset Variables.output.status = true />

<cfif isDefined("form.gRecaptchaResponse") >
    <cfif form.email_subject NEQ "" AND form.email_return NEQ "" AND form.email_message NEQ "" AND IsValid("email", form.email_return)>

        <cfhttp method="post" url="https://www.google.com/recaptcha/api/siteverify" result="gResult">
            <cfhttpparam type="formfield" name="secret" value="#Application.GoogleSecretKey#" />
            <cfhttpparam type="formfield" name="response" value="#form.gRecaptchaResponse#" />
            <cfhttpparam type="formfield" name="remoteip" value="#CGI.REMOTE_ADDR#" />
        </cfhttp>
        <cfset reResponse = deserializeJSON(gResult.filecontent) />


        <cfif reResponse.success EQ true>
            <!--- Google Recaptcha is correct so continue --->
            <cfparam name="form.email_subject" default="" />
            <cfparam name="form.email_return" default="" />
            <cfparam name="form.email_message" default="" />

                <cftry>
                    <cfmail from="contact@leetanderson.com" to="#Application.WebmasterEmail#" subject="#form.email_subject#">
                        A user on leetanderson.com with the email of #form.email_return# sent the following message:
                        #form.email_message#
                    </cfmail>
                    <cfcatch type="any">
                        <cfset Variables.output.message = "Email failed to send. Please try again later." />
                        <cfset Variables.output.status = false />
                    </cfcatch>
                </cftry>
        
        <cfelse>
            <cfset Variables.output.message = "Recaptcha failed. Please try again." />
            <cfset Variables.output.status = false />
        </cfif>

    <cfelse>
        <cfset Variables.output.message = "Subject, email, and message are all required. Your return email should also be in the format of account@domain.com." />
        <cfset Variables.output.status = false />
    </cfif>
<cfelse>
    <!--- Boot requests without a racaptcha response --->
    <cfset Variables.output.message = "Please complete the Recaptcha" />
    <cfset Variables.output.status = false />
</cfif>



<cfoutput>
    #serializeJSON(Variables.output)#
</cfoutput>

