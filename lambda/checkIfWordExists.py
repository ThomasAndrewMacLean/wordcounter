s3 = boto3.resource('s3')
obj = s3.Object('wordlistdutchwords', 'OpenTaal-210G-basis-gekeurd.txt')
allWords = obj.get()['Body'].read().decode("utf-8").upper().splitlines()

def lambda_handler(event, context):
    word = event["params"]["querystring"]["word"]
    
    print(word)
    print(allWords[1])
    if word.upper() in allWords:
        return {
            'statusCode': 200,
            'body': json.dumps("found it" + word)
        }
    else: 
        return {
            'statusCode': 404,
            'body': json.dumps('???' + word)
        }