import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import { useState } from "react";
import MenuSharpIcon from '@mui/icons-material/MenuSharp';

function SideBar({updateLang, width}) {
    const [isOpen, setIsOpen] = useState(false);

    function changeLang(currLang) {
        updateLang(currLang);
        setIsOpen(false);
    }

    return (
        <Box borderRight={"1px solid grey"} bgcolor={"#e8e8e8"} width={width}>
            <Button onClick={() => setIsOpen(true)} fullWidth><MenuSharpIcon /></Button>
            <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
                <Stack width={"10vw"}>
                    {/* try adding map */}
                    <Button onClick={() => changeLang("c")} sx={{color: "black"}}><Typography fontFamily={"Fira Mono"}>C</Typography></Button>
                    <Button onClick={() => changeLang("cpp")} sx={{color: "black"}}><Typography fontFamily={"Fira Mono"}>C++</Typography></Button>
                    <Button onClick={() => changeLang("python")} sx={{color: "black"}}><Typography fontFamily={"Fira Mono"}>Python</Typography></Button>
                </Stack>
            </Drawer>
        </Box>
    )
}

export default SideBar;