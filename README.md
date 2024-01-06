## Courier hub APP - SOME_VERY_MAGNIFICENT_NAME

## Project – the description
The team working on this project will create a Courier Hub that will give the option of requesting couriers from various sour ces/companies. The client of
that app can use WebSite to interact with the system. The Landing page should have some information about the system, like how many people use it, its
name, some short descriptions, and a button for creating it anonymously for delivery request inquiries. The inquiry should co ntain the dimensions of the
package, wieght, the delivery date, the destination and source address and two required options: priority (can be low, or high), and delivery at a
weekend. After requests are sent, the application should wait for the best deals from each integrated courier supplier. The a pplication should wait for
max 30sek for offers and shows that are available. It should show in the list form. The list item should contain the currier company name, the price for
delivery, option to get this offer. After clicking it if a person is not logged in we need to ask the user to create an accou nt or log in. If the user wants to go
in anonymous mode he should be able to. The next step for anonymous users is to give first name/last name/company name/email/ address information.
This page should also show a summary that will contain source and destination information, price split on taxes, service fee, distance fee, and additional
fees. If all data is provided, you can submit a request. After that, you should have to get requestId. Also, the client should get a notification that it was
requested with all order information. When this request is accepted (or auto-accepted) on the courier side client should get an email with the contract
agreement and receipt. After delivery client should be able to rate service. If the user was logged in or logged in on one o f the steps of getting an inquiry
his address information should be set up automatically. Also, he should have option to check all of his orders and check the history of his inquiries. The
user can add a request to his account if he has requestId. On details of each request, there should be information about steps in delivery. There will be
the option of cancelling the request if the supplier allows that by the deadline provided by the supplier. For purposes of th is project, we will reuse this
page for the courier company so if the login user is a currier from your company he should have a list of this company's deli very and he can change the
state of delivery to “received” with the courier name and date, “Delivered” with the courier name and date, “Cannot deliver” reason why it could be
delivered, date and courier name. He can filter out delivery requests by dates and status. You can also log in as an office worker and you should have the
option to look at all pending offerts and accept them or reject them. If accepted we should provide two files, agreement and receipt. Also, we need to
send a proper notification email (it should be separate from hub email). If it is rejected also, some notification should be sent.
Be aware that you need to create an API that will be used by different teams and your solution to get and get inquiries, and manage requests. Your API
should have some authorisation. Also, need to provide swagger documentation. You will also need to integrated provided by lecture API (it will be give
later in the process)


## Requirements overall
### Web UI (App) for Courier Hub app
 - [ ] Can register using AzureAD or other OpenId (Google, Facebook, custom)
 - [ ] When registered, need to provide some additional information:
    - [ ] First Name
    - [ ] Last Name
    - [ ] Address
    - [ ] Email
    - [ ] Default Source address
 - [ ] Need to use provided by lecturer Courier API
 - [ ] Need to use at least one other group API
 - [ ] Need to create own Courier API
 - [ ] Need to meet the business requirements
 - [ ] Need to meet the technical requirements

## Requirements – business part 1: Client

 -  [ ] Client can have register/login abilities
 -  [ ] Client (logged in) as default should see a list of the last 30 days’ inquires
 -  [ ] Package dimension and weight,
 -  [ ] Source and destination
 -  [ ] Date of inquiring
 -  [ ] Status
 -  [ ] If inquiry has offer, submit just one that we offer with the status of the offer
    -  [ ] Client (logged in) will have a button to create a new inquire
    -  [ ] Client (not logged in) will have a button to create a new inquire
 -  [ ] Client creating new inquire should provide
    -  [ ] Package dimension and weight,
    -  [ ] Source and destination
    -  [ ] Pickup date and delivery date
    -  [ ] If it is a company or not
    -  [ ] Pirority and delivery at weekend
 -  [ ] Client should get an email when the inquiry is submitted
 -  [ ] Client should get a list of possible offers
 -  [ ] Client can click on one of the offers to accept it (offer are valid for some time)
 -  [ ] Client should need to provide some that before he can submit acceptance of the offer
 -  [ ] Personal data or company data (if possible, take it form user data for logged in users)
 -  [ ] Address (if possible, take it form user data for logged-in users)
 -  [ ] Email address
 -  [ ] Client should get a link that he can use to check the offer status and the offer Id
 -  [ ] Client should get an email with a link to the offer status
 -  [ ] Client should get an email when the decision about it will be made

## Requirements – business part 2: Courier company office worker
 - [ ] Show all inquiries to your bank
    - [ ] Could be filtered out
    - [ ] Should be sortable
 - [ ] Show all offer request for your bank
    - [ ] Could be filtered out
    - [ ] Should be sortable
 - [ ] Can check details of the offers
    - [ ] Show all sent data
 - [ ] Can accept or reject pending offers
    - [ ] If accepted need to provide
        - [ ] Agreement
        - [ ] Receipt
    - [ ] If rejected need to provide reason why

## Requirements – business part 3: Courier
 - [ ] Show all delivery
    - [ ] Could be filtered out
    - [ ] Should be sortable
 - [ ] Can check details of the delivery
 - [ ] Can set delivery as picked up
    - [ ] Name of courier
    - [ ] Date of pickup
 - [ ] Can set delivered package
    - [ ] Name of courier
    - [ ] Date of delivery
 - [ ] Can set cannot deliver
    - [ ] Date of attempt
    - [ ] Name of courier
    - [ ] Reason why

## Requirements – business part 4: API functions

 - [ ] Create inquire
    - [ ] Some auth
    - [ ] Request must have all business needed fields as required
    - [ ] Can have some option
    - [ ] Need return id of this inquire
 - [ ] Create offer
    - [ ] Some auth
    - [ ] Required field check
 - [ ] Check the status of the offer
    - [ ] Some auth
    - [ ] Should require id
    - [ ] Return status with description
 - [ ] List of inquiring
    - [ ] Just for Courier company office worker
    - [ ] Return a list of inquiring
 - [ ] List of offers
    - [ ] Just for Courier comapny office worker
    - [ ] Return a list of offers
 - [ ] What the offer need to contain:
    - [ ] The inquire id
    - [ ] The date of creation of offer
    - [ ] The date of update of offer
    - [ ] The status offer (with description)
    - [ ] The requested value
    - [ ] The offer time period
    - [ ] Information about package
    - [ ] Information about Source and Delivery
    - [ ] Price (taxes, fees and other things)


 ## Technical requirements
 - [ ] Front-end
    - [ ] Javascript based (could react/angular if accepted by group lecturer)
    - [ ] Responsive
    - [ ] Using AJAX
    - [ ] Consistent
    - [ ] Host on Azure
 - [ ] Back-end
    - [ ] .NET (6 or Core 3.+) (Maybe the .NET CORE will be more suitable)
    - [ ] Host on Azure
    - [ ] Using SQL database with EntityFramework (or similar) as the provider
    - [ ] Use AzureBlob (or similar) to store files
    - [ ] Use SendGrid (or similar) for sending mail
    - [ ] Use some form of OpenId to authentication (or other based on OATH)
    - [ ] Create custom authorization or use OpenId to achieve that

## Technology stack
 - SCRUM, git, git-flow, Azure DevOps
 - Visual Studio\Rider
 - App Service, Azure SQL DB, Azure AD B2C, SendGrid
 - ASP.NET Core MVC, ASP.NET Core API, SQL, Entity Framework
 - REST, OAuth 2.0, OWIN
 - PowerShell
 - Unit Tests, Integration tests, UI tests, API tests
 - CD/CI

 ## Punction

Points

Overall		150

- [ ] Azure Devops		31

- [ ] Repository		
	Setup branch policies and security (with build)	2

	Create gitflow or other flow (other flow need to be described in Read.me file	1

	Prepare Read.me file	1

	Use PR with at least one review (need to show in history)	2

	Code history shows work was done in sprints	4
- [ ] Board		
	Features prepared (at least 4)	1

	Create user stories that cover functionalities (for at least 4 

   feature and fully fill-in)	1

	Create Tasks (for at least 4 user stories and fully fill-in)	1

	Create Sprints	1
   
Pipelines		
	Build pipeline (yaml)	2
	Deploy pipeline	6
	Custom versioning	2
	Connect with Azure(external) services	2
	Deploy is able to update database	2
Test		
	Create a test suite containing full test of one features	3
Logic		58
FrontEnd avilable		 
	Client => Lading page with all required elements	2
	Cleint => login ability	2
	Client => Create inquiry page with acceptnace (anonymous and not)	4
	Cleint => Show all offers made from inquires (timelimit, how its behave etc..) and option to accept and not	6
	Client => Order Status page (email and from the list)	2
	Client => List of all orders (with adding one made anonymous and with sorting and filtering)	3
	Company office worker => show all inquires page (with sorting and filtering)	2
	Company office worker => details page with accept or reject option	2
	Company office worker => show all offers page (with sorting and filtering)	2
	Courier => show all deliveries (with filtering nad sorting)	2
	Courier => delviery details with all operations	3
Backend only logic		2
	Sending emails	4
	Sending emails periodicly logic	2
	Auditing (headers, request, response,  audit call time and use Application Insight or other like that)	4
	Connect to own API	3
	Connect to API provided by lecture	3
	Connecting to  API provided by other team	4
	Files operation on some kind of cloud	4
AJAX calls to make site resposnsible (or SPA)		2
Others		55
Authentication (OpenId/Azure/Google)		6
AJAX calls to make site resposnsible (or SPA)		4
Database		
	Have indexes	2
	Have proper table structure	2
	POCO class differetn that Model class	2
	EF or other configuration in fluent way or in way that will be SRP and POCO class and configuration will be separated. Attributes not allowed	2
	Different project with DB integration tests (at least 3 integration tests)	3
	Migration and data seed	4
Backend (API or MVC app)		
	Autentication of correct routes	2
	Good extract of application features in backend	2
	Create authorization for other team	4
	Have swaggeger documentation (at least 50% of routes)	3
	Postman - at least one process > locally	2
	Use parallel in calls for the invoices	1
	Route name convention is solid accross project	2
Azure		
	Sending emails	2
	Push/pull files	2
Tests		
	Unit test at least at least 40% of code coverage, At least 2 integration test with own API	3
	E2E tests (Selenium/jest/other frameworks) and UT tests (at least 3 features fully cover by it)	4
	Create integration test for at least two scenarios	3
Architectural		6
Good models and domains		2
No security concerns		2
Using patterns (factory, builder etc..)		2
		