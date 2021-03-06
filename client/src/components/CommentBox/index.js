import React, {useEffect, useState} from 'react';
import {Flex, Textarea, Text, Button, Avatar, HStack} from '@chakra-ui/react';
import Axios from "axios";

function CommentBox(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(true);
    
    useEffect(() => {
      if (window.localStorage.getItem("loggedIn") === "true") {
        setLoggedIn(true);
        setIsUserLoading(false);
      } else if (window.localStorage.getItem("loggedIn") === "false") {
        setIsUserLoading(false);
      }
    }, [window.localStorage]);

    const threadId = props.threadId;
    let [value, setValue] = React.useState("")
    let [isLoading, setIsLoading] = React.useState(false)

    const defaultData = {
        username: "Anonymous",
        avatar: "",
    };

    function postMessage(threadId, comment) {
        setIsLoading(true);

        Axios.post("/api/thread/" + threadId + "/comments",
            {
                comment: comment
            })
            .then(res => {
                console.log("sent!");
                setIsLoading(false);
                props.updateComments();
            })
            .catch(err => {
                setIsLoading(false);
            });
    }

    let handleInputChange = (e) => {
        let inputValue = e.target.value
        setValue(inputValue)
    }

    const [data, setData] = useState(defaultData);

    useEffect(() => {
        setData({
            username: window.localStorage.getItem("username"),
            avatar: window.localStorage.getItem("avatar"),
        });
    }, [window.localStorage]);

    return (
        <Flex mt={4} mb={4} flexDir="column">
            <HStack>
                <Avatar size="xs" name={data.username} src={data.avatar}/>
                {isUserLoading || !loggedIn ? 
                <Text color="gray.600" fontSize="sm">Please log in first.</Text> :
                <Text color="gray.600" fontSize="sm">{data.username} says:</Text>}
            </HStack>
            <Textarea mt={2} focusBorderColor="purple.500"
                      placeholder="Write your thoughts about this data request..."
                      value={value}
                      onChange={handleInputChange}/>
            <Button disabled={isUserLoading || !loggedIn} isLoading={isLoading} onClick={() => {
                postMessage(threadId, value);
            }} colorScheme="purple"
                    mt={2}>Post</Button>
        </Flex>
    );
}

export default CommentBox;
