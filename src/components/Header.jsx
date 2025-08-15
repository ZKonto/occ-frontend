import { Grid } from "@mui/material";

function Header({ brand, langSelector, runButton, clearButton, config }) {
    return (
        <Grid
            container
            spacing={2}
            alignItems={"center"}
            bgcolor={"#dedede"}
            p={1}
        >
            <Grid item xs={12} sm={"auto"}>
                {brand}
            </Grid>

            <Grid item xs={12} sm={3} lg={2}>
                {langSelector}
            </Grid>

            <Grid item>{runButton}</Grid>

            <Grid item>{clearButton}</Grid>

            <Grid item>{config}</Grid>
        </Grid>
    );
}

export default Header;
