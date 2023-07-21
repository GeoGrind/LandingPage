/* 
University of Toronto: @mail.utoronto.ca
University of British Columbia: @student.ubc.ca
McGill University: @mail.mcgill.ca
University of Alberta: @ualberta.ca
University of Waterloo: @uwaterloo.ca
McMaster University: @mcmaster.ca
University of Ottawa: @uottawa.ca
Western University: @uwo.ca
Queen's University: @queensu.ca
University of Calgary: @ucalgary.ca
*/

export function endsWithCanadianUniversitySuffix(email: string): boolean {
  const universitySuffixes: string[] = [
    "@mail.utoronto.ca",
    "@student.ubc.ca",
    "@mail.mcgill.ca",
    "@ualberta.ca",
    "@uwaterloo.ca",
    "@mcmaster.ca",
    "@uottawa.ca",
    "@uwo.ca",
    "@queensu.ca",
    "@ucalgary.ca",
  ];
  return universitySuffixes.some((suffix) => email.endsWith(suffix));
}
