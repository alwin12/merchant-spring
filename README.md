# Thank You

Hi team,

Thank you for providing me the opportunity to work on this task!

# Issues

- **Inefficient Data Retrieval:** As mentioned in my email, implementing pagination and sorting with gzip files is challenging due to their sequential access nature. This can lead to increased server resource consumption as a large portion of the file may need to be processed in memory. Furthermore, the time it takes for a user to access a specific page increases linearly with the page number. My current understanding is that customers of MerchantSpring export their data in gzip format for importation and display on the dashboard.

- **Proposed Solution:** One strategy is to populate the database as soon as we receive the exported file asyncronously. This would allow users to directly query the database, facilitating efficient pagination with OFFSET and LIMIT clauses and utilizing database indexes for swift sorting and filtering.
As soon as a gzip file is received, it could be uploaded to an AWS S3 bucket. This would trigger a message to an SNS topic, which would then forward the message to an SQS system. A Lambda function could process the message from the SQS queue. This method offers several benefits:

- **Decoupling:** Separates the file upload process from data processing tasks.
- **Scalability:** Adjusts to the volume of uploaded files.
- **Durability and Reliability:** Ensures message retention and retrieval in case of processing failures.

- **Data Caching:** Frequently accessed data could be cached in memory storage solutions like Redis. This approach enhances data retrieval efficiency.


## Other Issues

- **Testing Challenges:** Encountered issues include:
  1) Errors thrown by Jest related to the table library used, potentially linked to an open issue on GitHub (https://github.com/table-library/react-table-library/issues/104).
  2) Ineffectiveness of jest.mock in mocking certain backend modules.

## Exclusions in This Implementation

- **UI:** The current UI is basic and can be improved with better loading indicators, value formatting, and styling.

- **Frontend Performance Enhancements:** Data caching on the frontend can be optimized, for example, by using Apollo with GraphQL.

- **Type Sharing in TypeScript:** Types have been duplicated; however, a monorepo or tools like Trpc could facilitate type sharing.

- **Debouncing Navigation and Sorting Controls:** Implementing debounce on "next," "previous," and "sort" buttons could prevent excessive backend requests.

- **Additional Testing:** Further testing is required to ensure robustness.

- Apologies as I have included everything in a single commit which is not a good practise at all! :)
