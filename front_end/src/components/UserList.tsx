import Drawer from "@mui/material/Drawer"
import axios from "axios"
import React, { Fragment, useContext, useEffect, useState } from "react"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { UrlContext } from "../context/UrlContext"
import { ListItemIcon } from "@mui/material"
import { Status } from "../enum/status"
import { useNavigate } from "react-router-dom"

const drawerWidth = 360

const UserList: React.FC<{channel: string}> = ({channel}) => {
	const [channelMembers, setChannelMembers] = useState<any[] | null>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [openEl, setOpenEl] = useState<null | string>(null)
	const navigate = useNavigate()
	const [open, setOpen] = useState(Boolean(anchorEl))
	const baseUrl = useContext(UrlContext)

	useEffect(() => {
		axios.get(baseUrl + `chat/${channel}/users`, {withCredentials: true}).then((response) => {
			setChannelMembers(response.data)
		})
	}, [baseUrl, channel, anchorEl])

	useEffect(() => {
		axios.get(baseUrl + `users/me`, {withCredentials: true}).then((response) => {
			axios.get(baseUrl + `chat/${channel}/admins`, {withCredentials: true}).then((resp2) => {
				if (resp2.data.includes(response.data.id)) {
					setIsAdmin(true)
				}
			}).catch((error) => {
				console.log(error)
			})
		}).catch((error) => {
			console.log(error)
		})
	}, [baseUrl, anchorEl, channel])

	const handleClick = (elem: any) => (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
		setOpenEl(elem.name)
		console.log(elem)
	}

	const handleClose = () => {
		setAnchorEl(null)
		setOpenEl(null)
	}
	
	const handleBan = (user: any) => () => {
		let banUser = {...user}

		console.log(banUser)
		axios.post(baseUrl + `chat/${channel}/ban`, banUser, {withCredentials: true}).catch((error) => {
			console.log(error)
		})
		handleClose()
	}

	return (
		<>
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant="permanent"
			anchor="right"
		>
			<Toolbar />
			<List>
				{channelMembers?.map((user: any, index: number) => {
					return (
						<Fragment key={index}>
							<ListItem>
								<ListItemText primary={user.name} />
								<ListItemIcon>
									{(user.status === Status.ONLINE) ? <CircleIcon style={{color: "green"}} fontSize="small" /> : <RadioButtonUncheckedIcon style={{color: "grey"}} fontSize="small" />}
								</ListItemIcon>
								<IconButton
									// aria-label="more"
									id="long-button"
									// aria-controls={openEl === user ? 'long-menu' : undefined}
									// aria-expanded={openEl === user? 'true' : undefined}
									// aria-haspopup="true"
									onClick={handleClick(user)}
								>
									<MoreVertIcon />
								</IconButton>
								<Menu
									id="long-menu"
									// MenuListProps={{
									// 	'aria-labelledby': 'long-button'
									// }}
									anchorEl={anchorEl}
									open={openEl === user.name}
									onClose={handleClose}
								>
									{isAdmin &&
									[<MenuItem key={0}>
										<Typography>
											Make admin
										</Typography>
									</MenuItem>,
									<MenuItem key={1}>
										<Typography>
											Mute
										</Typography>
									</MenuItem>,
									<MenuItem key={2}>
										<Typography>
											Kick
										</Typography>
									</MenuItem>,
									<MenuItem onClick={handleBan(user)} key={3}>
										<Typography>
											Ban
										</Typography>
									</MenuItem>]}
									<MenuItem key={4}>
										<Typography>
											View profile
										</Typography>
									</MenuItem>
									<MenuItem key={5}>
										<Typography>
											Invite to play
										</Typography>
									</MenuItem>
								</Menu>
							</ListItem>
							<hr />
						</Fragment>
					)
}				)}
			</List>
		</Drawer>
		</>
	)
}

export default UserList